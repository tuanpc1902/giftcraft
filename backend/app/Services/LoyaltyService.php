<?php

namespace App\Services;

use App\Models\LoyaltyTransaction;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LoyaltyService
{
    // Tier thresholds (cumulative points earned, not current balance)
    private const TIERS = [
        'diamond' => 2000,
        'gold'    => 500,
        'silver'  => 0,
    ];

    // 1 point per 10,000 VNĐ
    private const POINTS_PER_VND = 10_000;

    public function awardOrderPoints(Order $order): int
    {
        if (! $order->user_id) {
            return 0;
        }

        $points = (int) floor($order->total / self::POINTS_PER_VND);
        if ($points <= 0) {
            return 0;
        }

        // Double points if birthday month
        $user = $order->user;
        if ($user->birthday && $user->birthday->month === now()->month) {
            $points *= 2;
        }

        $this->addPoints($user, $points, 'earn', "Tích điểm từ đơn hàng #{$order->order_number}", $order->id);

        return $points;
    }

    public function addPoints(User $user, int $points, string $type, string $description, ?int $orderId = null): void
    {
        DB::transaction(function () use ($user, $points, $type, $description, $orderId) {
            $user->refresh();
            $newBalance = max(0, $user->loyalty_points + $points);

            $user->loyalty_points = $newBalance;
            $user->loyalty_tier = $this->calcTier($newBalance);
            $user->save();

            LoyaltyTransaction::create([
                'user_id'      => $user->id,
                'order_id'     => $orderId,
                'type'         => $type,
                'points'       => $points,
                'balance_after' => $newBalance,
                'description'  => $description,
            ]);
        });
    }

    public function redeemPoints(User $user, int $points): void
    {
        if ($user->loyalty_points < $points) {
            throw new \InvalidArgumentException('Không đủ điểm để đổi.');
        }

        $this->addPoints($user, -$points, 'redeem', "Đổi {$points} điểm");
    }

    private function calcTier(int $points): string
    {
        foreach (self::TIERS as $tier => $threshold) {
            if ($points >= $threshold) {
                return $tier;
            }
        }

        return 'silver';
    }

    public function getSummary(User $user): array
    {
        $transactions = $user->loyaltyTransactions()
            ->latest()
            ->limit(20)
            ->get();

        $nextTier = $this->nextTierInfo($user->loyalty_points);

        return [
            'points'         => $user->loyalty_points,
            'tier'           => $user->loyalty_tier,
            'next_tier'      => $nextTier,
            'transactions'   => $transactions,
        ];
    }

    private function nextTierInfo(int $points): ?array
    {
        if ($points >= self::TIERS['diamond']) {
            return null; // already max tier
        }

        $target = $points >= self::TIERS['gold'] ? self::TIERS['diamond'] : self::TIERS['gold'];
        $name   = $points >= self::TIERS['gold'] ? 'diamond' : 'gold';

        return [
            'tier'      => $name,
            'required'  => $target,
            'remaining' => $target - $points,
            'progress'  => round(($points / $target) * 100),
        ];
    }
}
