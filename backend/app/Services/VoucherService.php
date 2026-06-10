<?php

namespace App\Services;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Str;

class VoucherService
{
    public function issueBirthdayVoucher(User $user): Voucher
    {
        $code = 'BIRTHDAY-' . strtoupper(Str::random(6));

        return Voucher::create([
            'code'             => $code,
            'type'             => 'percent',
            'value'            => 10, // 10% off
            'min_order_amount' => 200_000,
            'max_discount'     => 200_000,
            'usage_limit'      => 1,
            'used_count'       => 0,
            'user_id'          => $user->id,
            'expires_at'       => now()->endOfMonth(),
        ]);
    }

    public function issueTierUpgradeVoucher(User $user, string $newTier): ?Voucher
    {
        $discounts = [
            'gold'    => ['type' => 'fixed',   'value' => 50_000],
            'diamond' => ['type' => 'percent', 'value' => 15, 'max' => 300_000],
        ];

        if (! isset($discounts[$newTier])) {
            return null;
        }

        $config = $discounts[$newTier];
        $code   = strtoupper($newTier) . '-' . strtoupper(Str::random(6));

        return Voucher::create([
            'code'             => $code,
            'type'             => $config['type'],
            'value'            => $config['value'],
            'min_order_amount' => 300_000,
            'max_discount'     => $config['max'] ?? null,
            'usage_limit'      => 1,
            'used_count'       => 0,
            'user_id'          => $user->id,
            'expires_at'       => now()->addDays(30),
        ]);
    }
}
