<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    /** GET /api/products/{slug}/reviews — public, approved only */
    public function index(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $reviews = Review::with('user:id,name')
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->orderByDesc('created_at')
            ->paginate(10);

        return $this->success([
            'items' => $reviews->items(),
            'meta'  => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    /** POST /api/products/{slug}/reviews — auth required */
    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title'  => ['nullable', 'string', 'max:120'],
            'body'   => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $user = $request->user();

        // One review per user per product
        $existing = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->whereNotIn('status', ['rejected'])
            ->first();

        if ($existing) {
            return $this->error('Bạn đã đánh giá sản phẩm này rồi.', 422);
        }

        // Check for verified purchase
        $order = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
            ->first();

        $review = Review::create([
            'user_id'              => $user->id,
            'product_id'           => $product->id,
            'order_id'             => $order?->id,
            'rating'               => $data['rating'],
            'title'                => $data['title'] ?? null,
            'body'                 => $data['body'],
            'is_verified_purchase' => (bool) $order,
            'status'               => 'pending',
        ]);

        return $this->success($review, 'Đánh giá đã gửi, đang chờ duyệt.', 201);
    }

    /** POST /api/reviews/{id}/helpful — mark a review as helpful */
    public function helpful(int $id): JsonResponse
    {
        $review = Review::where('id', $id)->where('status', 'approved')->firstOrFail();
        $review->increment('helpful_count');

        return $this->success(['helpful_count' => $review->helpful_count]);
    }
}
