<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class CartService
{
    private const TTL = 60 * 60 * 24 * 7; // 7 days

    /**
     * Resolve the Redis cart key for the current request.
     */
    public function keyFor(Request $request): string
    {
        if ($user = $request->user()) {
            return "cart:user:{$user->id}";
        }

        $sessionId = $request->header('X-Session-ID');
        abort_if(! $sessionId, 400, 'X-Session-ID header is required for guest carts.');

        return "cart:guest:{$sessionId}";
    }

    /**
     * Raw cart structure: ['items' => [product_id => qty], 'voucher' => code|null].
     */
    public function read(string $key): array
    {
        $raw = Redis::get($key);
        $data = $raw ? json_decode($raw, true) : [];

        return [
            'items' => $data['items'] ?? [],
            'voucher' => $data['voucher'] ?? null,
        ];
    }

    private function write(string $key, array $data): void
    {
        Redis::setex($key, self::TTL, json_encode($data));
    }

    public function addItem(string $key, int $productId, int $quantity): void
    {
        $product = Product::findOrFail($productId);
        abort_unless($product->stock_status === 'in_stock', 422, 'Sản phẩm đã hết hàng.');

        $cart = $this->read($key);
        $cart['items'][$productId] = ($cart['items'][$productId] ?? 0) + $quantity;
        $this->write($key, $cart);
    }

    public function updateItem(string $key, int $productId, int $quantity): void
    {
        $cart = $this->read($key);

        if ($quantity <= 0) {
            unset($cart['items'][$productId]);
        } else {
            $cart['items'][$productId] = $quantity;
        }

        $this->write($key, $cart);
    }

    public function removeItem(string $key, int $productId): void
    {
        $cart = $this->read($key);
        unset($cart['items'][$productId]);
        $this->write($key, $cart);
    }

    public function clear(string $key): void
    {
        Redis::del($key);
    }

    public function applyVoucher(string $key, string $code): array
    {
        $cart = $this->read($key);
        $summary = $this->summarize($cart);

        $voucher = Voucher::where('code', $code)->first();

        if (! $voucher || ($voucher->expires_at && $voucher->expires_at->isPast())) {
            abort(422, 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }
        if ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
            abort(422, 'Mã giảm giá đã hết lượt sử dụng.');
        }
        if ($summary['subtotal'] < $voucher->min_order_amount) {
            abort(422, 'Đơn hàng chưa đạt giá trị tối thiểu để dùng mã.');
        }

        $cart['voucher'] = $code;
        $this->write($key, $cart);

        return $this->toResponse($key);
    }

    public function removeVoucher(string $key): array
    {
        $cart = $this->read($key);
        $cart['voucher'] = null;
        $this->write($key, $cart);

        return $this->toResponse($key);
    }

    /**
     * Merge a guest cart into the user's cart (keeping the larger quantity on conflict).
     */
    public function merge(string $guestKey, string $userKey): void
    {
        $guest = $this->read($guestKey);
        if (empty($guest['items'])) {
            return;
        }

        $user = $this->read($userKey);
        foreach ($guest['items'] as $pid => $qty) {
            $user['items'][$pid] = max($user['items'][$pid] ?? 0, $qty);
        }
        $user['voucher'] = $user['voucher'] ?? $guest['voucher'];

        $this->write($userKey, $user);
        $this->clear($guestKey);
    }

    /**
     * Compute subtotal + total weight from raw cart (no presentation).
     *
     * @return array{subtotal:int, total_weight:int, products:\Illuminate\Support\Collection}
     */
    public function summarize(array $cart): array
    {
        $ids = array_keys($cart['items']);
        $products = Product::whereIn('id', $ids)->get()->keyBy('id');

        $subtotal = 0;
        $weight = 0;
        foreach ($cart['items'] as $pid => $qty) {
            $p = $products->get($pid);
            if (! $p) {
                continue;
            }
            $subtotal += (int) $p->retail_price * $qty;
            $weight += (int) $p->weight_grams * $qty;
        }

        return ['subtotal' => $subtotal, 'total_weight' => $weight, 'products' => $products];
    }

    /**
     * Full presentation payload for API responses.
     */
    public function toResponse(string $key): array
    {
        $cart = $this->read($key);
        $summary = $this->summarize($cart);
        $products = $summary['products'];

        $items = [];
        $totalItems = 0;
        foreach ($cart['items'] as $pid => $qty) {
            $p = $products->get($pid);
            if (! $p) {
                continue;
            }
            $totalItems += $qty;
            $items[] = [
                'product_id' => (int) $pid,
                'name' => $p->name,
                'slug' => $p->slug,
                'image' => $p->images[0] ?? null,
                'retail_price' => (int) $p->retail_price,
                'quantity' => $qty,
                'line_total' => (int) $p->retail_price * $qty,
            ];
        }

        $discount = 0;
        $voucherInfo = null;
        if ($cart['voucher']) {
            $voucher = Voucher::where('code', $cart['voucher'])->first();
            if ($voucher) {
                $discount = $this->discountFor($voucher, $summary['subtotal']);
                $voucherInfo = ['code' => $voucher->code, 'type' => $voucher->type, 'value' => (int) $voucher->value];
            }
        }

        return [
            'items' => $items,
            'subtotal' => $summary['subtotal'],
            'voucher' => $voucherInfo,
            'discount_amount' => $discount,
            'total_weight' => $summary['total_weight'],
            'total_items' => $totalItems,
        ];
    }

    public function discountFor(Voucher $voucher, int $subtotal): int
    {
        $discount = $voucher->type === 'percent'
            ? (int) round($subtotal * ((int) $voucher->value / 100))
            : (int) $voucher->value;

        if ($voucher->max_discount !== null) {
            $discount = min($discount, (int) $voucher->max_discount);
        }

        return min($discount, $subtotal);
    }
}
