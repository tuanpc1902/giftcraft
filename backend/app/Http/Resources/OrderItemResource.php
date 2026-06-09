<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'unit_price' => (int) $this->unit_price,
            'total_price' => (int) $this->total_price,
            'product_snapshot' => $this->product_snapshot,
        ];
    }
}
