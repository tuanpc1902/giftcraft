<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Services\ShippingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CartService $cart,
        private readonly ShippingService $shipping,
    ) {
    }

    public function calculate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'address' => ['required', 'array'],
            'address.city' => ['required', 'string'],
            'address.district' => ['nullable', 'string'],
            'delivery_type' => ['nullable', 'in:standard,express'],
        ]);

        $key = $this->cart->keyFor($request);
        $summary = $this->cart->summarize($this->cart->read($key));
        $weight = max($summary['total_weight'], 1);

        $standard = $this->shipping->calculate($data['address'], $weight);

        $response = [
            'standard' => [
                'fee' => $standard['fee'],
                'estimated_days' => $standard['estimated_days'],
            ],
        ];

        // Express only offered for inner-city HCM.
        $city = mb_strtolower($data['address']['city']);
        if (str_contains($city, 'hcm') || str_contains($city, 'hồ chí minh') || str_contains($city, 'ho chi minh')) {
            $express = $this->shipping->calculateExpress($data['address'], $weight);
            $response['express'] = [
                'fee' => $express['fee'],
                'estimated_days' => $express['estimated_days'],
                'note' => $express['note'],
            ];
        }

        return $this->success($response);
    }
}
