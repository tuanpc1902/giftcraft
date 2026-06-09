<?php

namespace App\Http\Resources;

use App\Services\B2bPricingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tiers = collect($this->b2b_price_tiers ?? []);
        $b2bMin = $tiers->pluck('price')->min();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'retail_price' => (int) $this->retail_price,
            'b2b_min_price' => $b2bMin !== null ? (int) $b2bMin : null,
            'stock_status' => $this->stock_status,
            'cover_image' => $this->images[0] ?? null,
            'is_customizable' => (bool) $this->is_customizable,
        ];
    }
}
