<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CartService $cart)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success($this->cart->toResponse($this->cart->keyFor($request)));
    }

    public function addItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $key = $this->cart->keyFor($request);
        $this->cart->addItem($key, $data['product_id'], $data['quantity']);

        return $this->success($this->cart->toResponse($key), 'Đã thêm vào giỏ hàng');
    }

    public function updateItem(Request $request, int $productId): JsonResponse
    {
        $data = $request->validate(['quantity' => ['required', 'integer', 'min:0']]);

        $key = $this->cart->keyFor($request);
        $this->cart->updateItem($key, $productId, $data['quantity']);

        return $this->success($this->cart->toResponse($key), 'Đã cập nhật');
    }

    public function removeItem(Request $request, int $productId): JsonResponse
    {
        $key = $this->cart->keyFor($request);
        $this->cart->removeItem($key, $productId);

        return $this->success($this->cart->toResponse($key), 'Đã xóa sản phẩm');
    }

    public function clear(Request $request): JsonResponse
    {
        $this->cart->clear($this->cart->keyFor($request));

        return $this->success(null, 'Đã xóa giỏ hàng');
    }

    public function applyVoucher(Request $request): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string']]);
        $key = $this->cart->keyFor($request);

        return $this->success($this->cart->applyVoucher($key, $data['code']), 'Đã áp dụng mã giảm giá');
    }

    public function removeVoucher(Request $request): JsonResponse
    {
        $key = $this->cart->keyFor($request);

        return $this->success($this->cart->removeVoucher($key), 'Đã gỡ mã giảm giá');
    }
}
