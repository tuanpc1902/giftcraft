<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShippingService
{
    private string $endpoint;
    private ?string $token;
    private ?string $shopId;

    public function __construct()
    {
        $this->endpoint = (string) config('services.ghn.endpoint', env('GHN_ENDPOINT'));
        $this->token = env('GHN_TOKEN');
        $this->shopId = env('GHN_SHOP_ID');
    }

    /**
     * Standard shipping fee via GHN, with a hard-coded fallback if the API is down.
     *
     * @return array{fee:int, estimated_days:int, service:string}
     */
    public function calculate(array $address, int $totalWeightGrams): array
    {
        try {
            if (! $this->token || ! $this->shopId) {
                throw new \RuntimeException('GHN credentials missing');
            }

            $response = Http::withHeaders([
                'Token' => $this->token,
                'ShopId' => $this->shopId,
            ])->timeout(8)->post($this->endpoint . '/v2/shipping-order/fee', [
                'weight' => max($totalWeightGrams, 1),
                'to_district_id' => $address['district_id'] ?? null,
                'to_ward_code' => $address['ward_code'] ?? null,
                'service_type_id' => 2, // standard
            ]);

            if ($response->successful() && isset($response['data']['total'])) {
                return [
                    'fee' => (int) $response['data']['total'],
                    'estimated_days' => 2,
                    'service' => 'standard',
                ];
            }

            throw new \RuntimeException('GHN returned an unexpected response');
        } catch (\Throwable $e) {
            Log::warning('GHN standard fee failed, using fallback', ['error' => $e->getMessage()]);
            $fallback = $this->fallbackCalculate($address, $totalWeightGrams);

            return [
                'fee' => $fallback['fee'],
                'estimated_days' => $fallback['estimated_days'],
                'service' => 'standard',
            ];
        }
    }

    /**
     * Express delivery (same-day, inner-city HCM only).
     *
     * @return array{fee:int, estimated_days:int, note:string}
     */
    public function calculateExpress(array $address, int $totalWeightGrams): array
    {
        $base = $this->fallbackCalculate($address, $totalWeightGrams);

        return [
            'fee' => $base['fee'] + 30000, // express surcharge
            'estimated_days' => 0,
            'note' => 'Giao trong ngày, chỉ nội thành HCM',
        ];
    }

    /**
     * Hard-coded weight-tier fallback when GHN is unavailable.
     * 0-500g: 30k · 500g-2kg: 45k · 2-5kg: 65k · 5kg+: 99k.
     * Inter-province (outside HCM/Hanoi) ×1.5.
     *
     * @return array{fee:int, estimated_days:int}
     */
    private function fallbackCalculate(array $address, int $totalWeightGrams): array
    {
        $fee = match (true) {
            $totalWeightGrams <= 500 => 30000,
            $totalWeightGrams <= 2000 => 45000,
            $totalWeightGrams <= 5000 => 65000,
            default => 99000,
        };

        $city = mb_strtolower($address['city'] ?? '');
        $isInnerProvince = str_contains($city, 'hcm')
            || str_contains($city, 'hồ chí minh')
            || str_contains($city, 'ho chi minh');

        if (! $isInnerProvince) {
            $fee = (int) round($fee * 1.5);
        }

        return [
            'fee' => $fee,
            'estimated_days' => $isInnerProvince ? 1 : 4,
        ];
    }
}
