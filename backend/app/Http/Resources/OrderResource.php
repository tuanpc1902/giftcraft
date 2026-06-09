<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_number,
            'status' => $this->status,
            'subtotal' => (int) $this->subtotal,
            'discount_amount' => (int) $this->discount_amount,
            'shipping_fee' => (int) $this->shipping_fee,
            'total' => (int) $this->total,
            'shipping_address' => $this->shipping_address,
            'delivery_type' => $this->delivery_type,
            'requested_delivery_date' => $this->requested_delivery_date?->toDateString(),
            'gift_message' => $this->gift_message,
            'customer_note' => $this->customer_note,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
