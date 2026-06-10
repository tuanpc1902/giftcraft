<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\B2bQuote;
use App\Services\B2bPricingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class B2bQuoteController extends Controller
{
    use ApiResponse;

    public function store(Request $request, B2bPricingService $pricing): JsonResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'occasion' => ['required', 'string', 'max:100'],
            'quantity_requested' => ['required', 'integer', 'min:1'],
            'budget_min' => ['nullable', 'numeric'],
            'budget_max' => ['nullable', 'numeric'],
            'deadline' => ['nullable', 'date'],
            'custom_requirements' => ['nullable', 'string', 'max:2000'],
            'brief_file_url' => ['nullable', 'string', 'url'],
            'product_id' => ['nullable', 'exists:products,id'],
        ]);

        $tierLabel = $pricing->matchTierLabel($data['quantity_requested']);
        $data['tier_matched'] = $tierLabel;
        $data['user_id'] = $request->user()?->id;
        $data['status'] = 'new';

        $quote = B2bQuote::create($data);

        // TODO Phase 2: dispatch NotifySalesNewQuote + ConfirmB2bQuoteReceived emails

        return $this->success([
            'id' => $quote->id,
            'tier_matched' => $tierLabel,
            'message' => 'Yêu cầu đã được ghi nhận. Chúng tôi sẽ liên hệ trong 24h.',
        ], 'Gửi yêu cầu thành công', 201);
    }

    /** Alias for /b2b/quotes/my — user's own quotes */
    public function my(Request $request): JsonResponse
    {
        return $this->index($request);
    }

    public function index(Request $request): JsonResponse
    {
        $quotes = B2bQuote::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return $this->success([
            'items' => $quotes->items(),
            'meta' => [
                'current_page' => $quotes->currentPage(),
                'last_page'    => $quotes->lastPage(),
                'total'        => $quotes->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $quote = B2bQuote::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return $this->success($quote);
    }

    // Admin
    public function adminIndex(Request $request): JsonResponse
    {
        $query = B2bQuote::orderByDesc('created_at');
        if ($request->filled('status')) $query->where('status', $request->query('status'));

        $quotes = $query->paginate(30);

        return $this->success([
            'items' => $quotes->items(),
            'meta' => ['current_page' => $quotes->currentPage(), 'last_page' => $quotes->lastPage(), 'total' => $quotes->total()],
        ]);
    }

    public function adminUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status'       => ['sometimes', 'in:new,reviewing,quoted,approved,in_production,delivered,cancelled'],
            'quoted_price' => ['nullable', 'numeric', 'min:0'],
            'admin_note'   => ['nullable', 'string', 'max:2000'],
            'sales_notes'  => ['nullable', 'string', 'max:2000'],
            'assigned_to'  => ['nullable', 'exists:users,id'],
        ]);

        $quote = B2bQuote::findOrFail($id);
        $quote->update($data);

        return $this->success($quote, 'Đã cập nhật');
    }
}
