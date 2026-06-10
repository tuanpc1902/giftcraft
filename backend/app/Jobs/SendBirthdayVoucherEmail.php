<?php

namespace App\Jobs;

use App\Mail\BirthdayVoucherMail;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBirthdayVoucherEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [300, 900, 3600];

    public function __construct(public int $userId, public int $voucherId)
    {
        $this->onQueue('emails');
    }

    public function handle(): void
    {
        $user    = User::find($this->userId);
        $voucher = Voucher::find($this->voucherId);

        if (! $user || ! $voucher) {
            return;
        }

        Mail::to($user->email)->send(new BirthdayVoucherMail($user, $voucher));
    }
}
