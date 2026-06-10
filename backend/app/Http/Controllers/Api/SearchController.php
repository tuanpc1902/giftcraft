<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request): JsonResponse
    {
        $q = (string) $request->query('q', '');
        $perPage = min((int) $request->query('per_page', 20), 50);
        $page = max((int) $request->query('page', 1), 1);

        if ($q === '') {
            return $this->success([
                'items' => [],
                'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => $perPage, 'total' => 0],
                'query' => '',
            ]);
        }

        $results = Product::search($q)
            ->paginate($perPage, 'page', $page);

        $items = collect($results->items())->map(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'retail_price' => (int) $p->retail_price,
            'stock_status' => $p->stock_status,
            'cover_image' => $p->images[0] ?? null,
            'is_customizable' => (bool) $p->is_customizable,
        ])->values();

        return $this->success([
            'items' => $items,
            'meta' => [
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
            ],
            'query' => $q,
        ]);
    }
}
