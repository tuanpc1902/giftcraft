<?php

namespace App\Services;

use App\Models\Product;

class B2bPricingService
{
    /**
     * Quantity thresholds → human label. Mirrors the 5 standard tiers.
     */
    private const TIERS = [20, 50, 100, 200, 300];

    /**
     * Get the applicable B2B tier for a given quantity.
     *
     * @return array{tier:string, price:int|float, savings_vs_retail:string}|null
     */
    public function getApplicableTier(Product $product, int $quantity): ?array
    {
        $tiers = $this->normalizeTiers($product);
        if (empty($tiers) || $quantity < $tiers[0]['qty']) {
            return null;
        }

        $matched = null;
        foreach ($tiers as $tier) {
            if ($quantity >= $tier['qty']) {
                $matched = $tier;
            }
        }

        if ($matched === null) {
            return null;
        }

        return [
            'tier' => 'Từ ' . $matched['qty'],
            'price' => $matched['price'],
            'savings_vs_retail' => $this->savingsPercent($product->retail_price, $matched['price']) . '%',
        ];
    }

    /**
     * All tiers for display, flagging which one currently applies.
     *
     * @return array<int, array{qty_label:string, qty:int, price:int|float, savings_percent:int, is_applicable:bool}>
     */
    public function getAllTiersDisplay(Product $product, int $quantity = 0): array
    {
        $tiers = $this->normalizeTiers($product);

        // Determine the single applicable tier (highest threshold <= quantity).
        $applicableQty = null;
        foreach ($tiers as $tier) {
            if ($quantity >= $tier['qty']) {
                $applicableQty = $tier['qty'];
            }
        }

        return array_map(function (array $tier) use ($product, $applicableQty) {
            return [
                'qty_label' => 'Từ ' . $tier['qty'],
                'qty' => $tier['qty'],
                'price' => $tier['price'],
                'savings_percent' => $this->savingsPercent($product->retail_price, $tier['price']),
                'is_applicable' => $applicableQty !== null && $tier['qty'] === $applicableQty,
            ];
        }, $tiers);
    }

    /**
     * Match a tier label from a raw quantity (used when creating b2b_quotes).
     */
    public function matchTierLabel(int $quantity): ?string
    {
        $matched = null;
        foreach (self::TIERS as $threshold) {
            if ($quantity >= $threshold) {
                $matched = $threshold;
            }
        }

        return $matched !== null ? 'Từ ' . $matched : null;
    }

    /**
     * Normalize the JSON tiers into a sorted [{qty, price}] array.
     *
     * @return array<int, array{qty:int, price:int|float}>
     */
    private function normalizeTiers(Product $product): array
    {
        $raw = $product->b2b_price_tiers ?? [];
        $tiers = [];

        foreach ($raw as $item) {
            if (! isset($item['qty'], $item['price'])) {
                continue;
            }
            $tiers[] = ['qty' => (int) $item['qty'], 'price' => $item['price']];
        }

        usort($tiers, fn ($a, $b) => $a['qty'] <=> $b['qty']);

        return $tiers;
    }

    private function savingsPercent(int|float $retail, int|float $price): int
    {
        if ($retail <= 0) {
            return 0;
        }

        return (int) round((($retail - $price) / $retail) * 100);
    }
}
