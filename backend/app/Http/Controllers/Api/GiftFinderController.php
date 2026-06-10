<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductListResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GiftFinderController extends Controller
{
    use ApiResponse;

    private const BUDGET_MAP = [
        'under300'  => [0,       300000],
        '300-600'   => [300000,  600000],
        '600-1000'  => [600000, 1000000],
        'over1000'  => [1000000, PHP_INT_MAX],
    ];

    private const OCCASION_CATEGORY = [
        'birthday'    => 'sinh-nhat',
        'wedding'     => 'cuoi-hoi',
        'tet'         => 'tet',
        'khai-truong' => 'khai-truong',
        'tri-an'      => 'tri-an',
        'su-kien'     => 'su-kien',
    ];

    public function suggest(Request $request): JsonResponse
    {
        $data = $request->validate([
            'recipient' => ['nullable', 'string'],
            'occasion'  => ['nullable', 'string'],
            'budget'    => ['nullable', 'string'],
            'style'     => ['nullable', 'string'],
        ]);

        $query = Product::where('is_active', true);

        // Budget filter
        [$min, $max] = self::BUDGET_MAP[$data['budget'] ?? ''] ?? [0, PHP_INT_MAX];
        if ($min > 0) $query->where('retail_price', '>=', $min);
        if ($max < PHP_INT_MAX) $query->where('retail_price', '<=', $max);

        // Occasion → category
        $categorySlug = self::OCCASION_CATEGORY[$data['occasion'] ?? ''] ?? null;
        if ($categorySlug) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug)
                ->orWhere('slug', 'like', '%' . $categorySlug . '%'));
        }

        // B2B recipient boosts customisable products
        if (in_array($data['recipient'] ?? '', ['doi-tac', 'doanh-nghiep'], true)) {
            $query->orderByDesc('is_customizable');
        }

        $products = $query->inRandomOrder()->limit(6)->get();

        // Add a human-readable match reason to each product
        $budgetLabel = [
            'under300' => 'Dưới 300.000đ',
            '300-600'  => '300k – 600k',
            '600-1000' => '600k – 1 triệu',
            'over1000' => 'Trên 1 triệu',
        ][$data['budget'] ?? ''] ?? 'phù hợp ngân sách';

        $result = ProductListResource::collection($products)->map(fn ($r) => array_merge(
            $r->toArray($request),
            ['match_reason' => "Phù hợp dịp " . ($data['occasion'] ?? 'tặng quà') . " · " . $budgetLabel]
        ));

        return $this->success($result->values());
    }
}
