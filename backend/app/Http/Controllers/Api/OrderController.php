<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Jobs\SendOrderStatusUpdate;
use App\Jobs\SendReviewRequestEmail;
use App\Models\Order;
use App\Services\LoyaltyService;
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
     * Accepts order_number (e.g. GC-20260610-00001) — NOT a numeric ID.
     */
    public function updateStatus(Request $request, string $orderNumber, LoyaltyService $loyalty): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
        ]);

        $order = Order::with('user')->where('order_number', $orderNumber)->firstOrFail();
        $previousStatus = $order->status;
        $order->update(['status' => $data['status']]);

        SendOrderStatusUpdate::dispatch($order->id, $data['status']);

        // Award loyalty points once order is delivered
        if ($data['status'] === 'delivered' && $previousStatus !== 'delivered' && $order->user) {
            $loyalty->awardOrderPoints($order);
        }

        // Request review email 3 days after delivery
        if ($data['status'] === 'delivered' && $previousStatus !== 'delivered') {
            SendReviewRequestEmail::dispatch($order->id)->delay(now()->addDays(3));
        }

        return $this->success(new OrderResource($order->load('items')), 'Đã cập nhật trạng thái');
    }
}
