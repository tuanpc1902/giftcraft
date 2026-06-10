<?php

use App\Jobs\SendAbandonedCartEmail;
use App\Jobs\SendBirthdayVoucherEmail;
use App\Models\User;
use App\Services\CartService;
use App\Services\VoucherService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Issue birthday vouchers daily at 7 AM
Schedule::call(function () {
    $today   = now();
    $service = app(VoucherService::class);

    User::whereNotNull('birthday')
        ->whereMonth('birthday', $today->month)
        ->whereDay('birthday', $today->day)
        ->where('role', '!=', 'admin')
        ->each(function (User $user) use ($service) {
            // Skip if they already have a birthday voucher this month
            $alreadyIssued = $user->vouchers()
                ->where('code', 'like', 'BIRTHDAY-%')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->exists();

            if ($alreadyIssued) {
                return;
            }

            $voucher = $service->issueBirthdayVoucher($user);
            SendBirthdayVoucherEmail::dispatch($user->id, $voucher->id);
        });
})->dailyAt('07:00')->name('issue-birthday-vouchers');

// Send abandoned cart reminders daily at 10 AM
// Targets auth users whose cart has items and haven't been emailed in 48h
Schedule::call(function () {
    $cartService = app(CartService::class);
    $prefix      = config('database.redis.options.prefix', '');

    // SCAN for all user cart keys (safe for production — no KEYS *)
    $cursor = '0';
    do {
        [$cursor, $keys] = Redis::connection()->executeRaw(['SCAN', $cursor, 'MATCH', "{$prefix}cart:user:*", 'COUNT', 200]);
        foreach ($keys as $fullKey) {
            // Strip the Redis prefix to get the bare key
            $key    = $prefix ? ltrim(substr($fullKey, strlen($prefix)), '') : $fullKey;
            $userId = (int) str_replace('cart:user:', '', $key);
            if ($userId <= 0) {
                continue;
            }

            // Skip if already notified in last 48h
            $notifiedKey = "abandoned_cart_notified:{$userId}";
            if (Redis::exists($notifiedKey)) {
                continue;
            }

            $cart = $cartService->read("cart:user:{$userId}");
            if (empty($cart['items'])) {
                continue;
            }

            $user = User::find($userId);
            if (! $user || $user->role === 'admin') {
                continue;
            }

            SendAbandonedCartEmail::dispatch($userId);
            Redis::setex($notifiedKey, 60 * 60 * 48, '1');
        }
    } while ($cursor !== '0');
})->dailyAt('10:00')->name('abandoned-cart-emails');
