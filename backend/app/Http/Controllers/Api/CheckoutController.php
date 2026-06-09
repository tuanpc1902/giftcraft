<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\Payment\MoMoService;
use App\Services\Payment\VNPayService;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OrderService $orders,
        private readonly CartService $cart,
    ) {
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $idempotencyKey = $request->header('Idempotency-Key');
        if (! $idempotencyKey) {
            return $this->error('Thiếu Idempotency-Key header.', [], 422);
        }

        $cartKey = $this->cart->keyFor($request);
        $userId = $request->user()?->id;

        $result = $this->orders->checkout(
            $request->validated(),
            $cartKey,
            $userId,
            $idempotencyKey,
        );

        $response = [
            'order_number' => $result['order_number'],
            'status' => $result['status'],
        ];

        // Attach a payment URL for online methods.
        if (isset($result['order']) && in_array($result['payment_method'], ['vnpay', 'momo'], true)) {
            $order = $result['order'];
            $response['payment_url'] = $result['payment_method'] === 'vnpay'
                ? app(VNPayService::class)->createPaymentUrl($order, $request->ip())
                : app(MoMoService::class)->createPaymentUrl($order);
        }

        return $this->success($response, 'Đặt hàng thành công', 201);
    }
}
