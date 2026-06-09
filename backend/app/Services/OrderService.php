<?php

namespace App\Services;

use App\Jobs\SendOrderConfirmationEmail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        private readonly CartService $cart,
        private readonly ShippingService $shipping,
        private readonly OrderNumberService $orderNumbers,
    ) {
    }

    /**
     * Create an order from the current cart. Atomic + idempotent.
     *
     * @param  array  $payload  validated checkout payload
     * @param  string  $cartKey  resolved cart Redis key
     * @param  int|null  $userId  authed user id (null = guest)
     * @param  string  $idempotencyKey
     */
    public function checkout(array $payload, string $cartKey, ?int $userId, string $idempotencyKey): array
    {
        $cacheKey = "idempotency:{$idempotencyKey}";

        // Return cached response for a replayed request.
        if ($cached = Redis::get($cacheKey)) {
            return json_decode($cached, true);
        }

        $cart = $this->cart->read($cartKey);
        if (empty($cart['items'])) {
            throw ValidationException::withMessages(['cart' => ['Giỏ hàng trống.']]);
        }

        $result = DB::transaction(function () use ($payload, $cart, $cartKey, $userId, $idempotencyKey) {
            $productIds = array_keys($cart['items']);

            // Lock product rows for the duration of the transaction.
            $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            $subtotal = 0;
            $weight = 0;
            $itemsData = [];

            foreach ($cart['items'] as $pid => $qty) {
                $product = $products->get($pid);
                if (! $product) {
                    throw ValidationException::withMessages(['cart' => ["Sản phẩm #{$pid} không tồn tại."]]);
                }
                if ($product->stock_status !== 'in_stock') {
                    throw ValidationException::withMessages(['cart' => ["{$product->name} đã hết hàng."]]);
                }

                $lineTotal = (int) $product->retail_price * $qty;
                $subtotal += $lineTotal;
                $weight += (int) $product->weight_grams * $qty;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit_price' => (int) $product->retail_price,
                    'total_price' => $lineTotal,
                    'product_snapshot' => [
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'image' => $product->images[0] ?? null,
                        'sku' => $product->sku,
                    ],
                ];
            }

            // Voucher discount.
            $discount = 0;
            $voucher = null;
            if (! empty($payload['voucher_code'])) {
                $voucher = Voucher::where('code', $payload['voucher_code'])->lockForUpdate()->first();
                if ($voucher && (! $voucher->expires_at || $voucher->expires_at->isFuture())
                    && ($voucher->usage_limit === null || $voucher->used_count < $voucher->usage_limit)
                    && $subtotal >= $voucher->min_order_amount) {
                    $discount = $this->cart->discountFor($voucher, $subtotal);
                } else {
                    $voucher = null; // invalid → ignore silently at checkout
                }
            }

            // Shipping fee.
            $shippingFee = $payload['delivery_type'] === 'express'
                ? $this->shipping->calculateExpress($payload['shipping_address'], $weight)['fee']
                : $this->shipping->calculate($payload['shipping_address'], $weight)['fee'];

            $total = max($subtotal - $discount + $shippingFee, 0);

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $this->orderNumbers->generate(),
                'status' => $payload['payment_method'] === 'cod' ? 'confirmed' : 'pending',
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'shipping_address' => $payload['shipping_address'],
                'delivery_type' => $payload['delivery_type'],
                'requested_delivery_date' => $payload['requested_delivery_date'] ?? null,
                'gift_message' => $payload['gift_message'] ?? null,
                'customer_note' => $payload['customer_note'] ?? null,
                'payment_method' => $payload['payment_method'],
                'payment_status' => 'pending',
                'idempotency_key' => $idempotencyKey,
            ]);

            foreach ($itemsData as $item) {
                $order->items()->create($item);
            }

            if ($voucher) {
                $voucher->increment('used_count');
            }

            // Empty the cart.
            $this->cart->clear($cartKey);

            return $order;
        });

        // Persist idempotency snapshot for 24h.
        $response = [
            'order_number' => $result->order_number,
            'status' => $result->status,
            'total' => (int) $result->total,
            'payment_method' => $result->payment_method,
        ];
        Redis::setex($cacheKey, 60 * 60 * 24, json_encode($response));

        // Dispatch confirmation email (queued).
        SendOrderConfirmationEmail::dispatch($result->id);

        return array_merge($response, ['order' => $result]);
    }
}
