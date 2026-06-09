<?php

namespace App\Http\Resources;

use App\Services\B2bPricingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $pricing = app(B2bPricingService::class);

        $tiers = collect($pricing->getAllTiersDisplay($this->resource))->map(fn ($t) => [
            'qty_label' => $t['qty_label'],
            'price' => (int) $t['price'],
            'savings_percent' => $t['savings_percent'],
        ])->values();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'retail_price' => (int) $this->retail_price,
            'b2b_price_tiers' => $tiers,
            'stock_status' => $this->stock_status,
            'weight_grams' => (int) $this->weight_grams,
            'sku' => $this->sku,
            'images' => $this->images ?? [],
            'is_customizable' => (bool) $this->is_customizable,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'version' => (int) $this->version,
            'related_products' => ProductListResource::collection($this->whenLoaded('relatedProducts')),
            'reviews_summary' => $this->when(isset($this->reviews_summary), $this->reviews_summary),
        ];
    }
}
