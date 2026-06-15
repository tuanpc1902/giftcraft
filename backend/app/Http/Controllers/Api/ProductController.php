<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductListResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $params = $request->only(['category', 'occasion', 'min_price', 'max_price', 'sort', 'page', 'per_page']);
        $bust = (int) Redis::get('products_cache_bust') ?: 0;
        $cacheKey = "products:v{$bust}:" . md5(json_encode($params));

        $payload = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($request) {
            $query = Product::query()->where('is_active', true);

            if ($slug = $request->query('category')) {
                $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
            }

            if ($occasion = $request->query('occasion')) {
                $query->whereHas('category', fn ($q) => $q->where('occasion_type', $occasion));
            }

            if ($request->filled('min_price')) {
                $query->where('retail_price', '>=', (int) $request->query('min_price'));
            }

            if ($request->filled('max_price')) {
                $query->where('retail_price', '<=', (int) $request->query('max_price'));
            }

            if ($request->filled('customizable')) {
                $query->where('is_customizable', true);
            }

            match ($request->query('sort')) {
                'price_asc' => $query->orderBy('retail_price'),
                'price_desc' => $query->orderByDesc('retail_price'),
                'oldest' => $query->orderBy('created_at'),
                default => $query->orderByDesc('created_at'),
            };

            $perPage = min((int) $request->query('per_page', 20), 50);
            $paginator = $query->paginate($perPage);

            return [
                'items' => ProductListResource::collection($paginator->items()),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ];
        });

        return $this->success($payload);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Cache::remember("product:{$slug}", now()->addMinutes(10), function () use ($slug) {
            $product = Product::with('category')
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();

            // Related: 4 products in the same category.
            $related = Product::where('is_active', true)
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->limit(4)
                ->get();
            $product->setRelation('relatedProducts', $related);

            // Reviews summary.
            $approved = $product->reviews()->where('status', 'approved');
            $distribution = (clone $approved)
                ->selectRaw('rating, count(*) as c')
                ->groupBy('rating')
                ->pluck('c', 'rating');

            $product->reviews_summary = [
                'average_rating' => round((float) (clone $approved)->avg('rating'), 1),
                'total_count' => (clone $approved)->count(),
                'distribution' => collect(range(1, 5))->mapWithKeys(
                    fn ($r) => [$r => (int) ($distribution[$r] ?? 0)]
                ),
            ];

            return $product;
        });

        return $this->success(new ProductDetailResource($product));
    }
}
