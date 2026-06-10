<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'pending');

        $reviews = Review::with('user:id,name', 'product:id,name,slug')
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(30);

        return $this->success([
            'items' => $reviews->items(),
            'meta'  => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected,pending'],
        ]);

        $review = Review::findOrFail($id);
        $review->update($data);

        return $this->success($review, 'Đã cập nhật đánh giá');
    }

    public function destroy(int $id): JsonResponse
    {
        Review::findOrFail($id)->delete();

        return $this->success(null, 'Đã xóa đánh giá');
    }
}
