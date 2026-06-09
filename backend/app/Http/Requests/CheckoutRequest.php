<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address' => ['required', 'array'],
            'shipping_address.name' => ['required', 'string', 'max:255'],
            'shipping_address.phone' => ['required', 'string', 'max:20'],
            'shipping_address.address' => ['required', 'string', 'max:500'],
            'shipping_address.ward' => ['nullable', 'string', 'max:255'],
            'shipping_address.district' => ['required', 'string', 'max:255'],
            'shipping_address.city' => ['required', 'string', 'max:255'],
            'delivery_type' => ['required', 'in:standard,express'],
            'requested_delivery_date' => ['nullable', 'date', 'after_or_equal:today'],
            'gift_message' => ['nullable', 'string', 'max:200'],
            'customer_note' => ['nullable', 'string', 'max:100'],
            'payment_method' => ['required', 'in:cod,vnpay,momo'],
            'voucher_code' => ['nullable', 'string'],
        ];
    }
}
