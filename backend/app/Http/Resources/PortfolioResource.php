<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'client_name' => $this->client_name,
            'occasion' => $this->occasion,
            'industry' => $this->industry,
            'quantity' => $this->quantity,
            'cover_image' => $this->cover_image,
            'gallery_images' => $this->gallery_images ?? [],
            'description' => $this->description,
            'is_featured' => (bool) $this->is_featured,
        ];
    }
}
