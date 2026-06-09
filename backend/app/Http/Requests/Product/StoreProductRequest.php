<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gated by role:admin middleware
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'retail_price' => ['required', 'integer', 'min:0'],
            'b2b_price_tiers' => ['nullable', 'array', 'size:5'],
            'b2b_price_tiers.*.qty' => ['required_with:b2b_price_tiers', 'integer', 'min:1'],
            'b2b_price_tiers.*.price' => ['required_with:b2b_price_tiers', 'integer', 'min:0'],
            'stock_status' => ['required', 'in:in_stock,out_of_stock,pre_order'],
            'weight_grams' => ['required', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:64', 'unique:products,sku'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'is_active' => ['boolean'],
            'is_customizable' => ['boolean'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
