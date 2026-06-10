<?php

use App\Jobs\SendBirthdayVoucherEmail;
use App\Models\User;
use App\Services\VoucherService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
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
