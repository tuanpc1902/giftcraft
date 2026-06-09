<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gated by role:admin middleware
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'version' => ['required', 'integer'], // optimistic locking
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'retail_price' => ['sometimes', 'integer', 'min:0'],
            'b2b_price_tiers' => ['nullable', 'array', 'size:5'],
            'b2b_price_tiers.*.qty' => ['required_with:b2b_price_tiers', 'integer', 'min:1'],
            'b2b_price_tiers.*.price' => ['required_with:b2b_price_tiers', 'integer', 'min:0'],
            'stock_status' => ['sometimes', 'in:in_stock,out_of_stock,pre_order'],
            'weight_grams' => ['sometimes', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:64', Rule::unique('products', 'sku')->ignore($id)],
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
