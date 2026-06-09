<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Jobs\SendOrderStatusUpdate;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    /**
     * Public order lookup by order_number (used for the confirmation/polling page).
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

        return $this->success(new OrderResource($order));
    }

    /**
     * List the authenticated user's orders.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->success([
            'items' => OrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Admin: list all orders with optional filters.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Order::with('items')->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('delivery_type')) {
            $query->where('delivery_type', $request->query('delivery_type'));
        }

        $orders = $query->paginate(30);

        return $this->success([
            'items' => OrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Admin: update order status and notify the customer.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $data['status']]);

        SendOrderStatusUpdate::dispatch($order->id, $data['status']);

        return $this->success(new OrderResource($order->load('items')), 'Đã cập nhật trạng thái');
    }
}
