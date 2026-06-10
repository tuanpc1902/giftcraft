<?php

namespace App\Jobs;

use App\Mail\AbandonedCartMail;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAbandonedCartEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public array $backoff = [600];

    public function __construct(public int $userId)
    {
        $this->onQueue('emails');
    }

    public function handle(CartService $cart): void
    {
        $user = User::find($this->userId);
        if (! $user) {
            return;
        }

        $cartData = $cart->toResponse("cart:user:{$user->id}");
        if (empty($cartData['items'])) {
            return; // cart was cleared before the job ran
        }

        Mail::to($user->email)->send(new AbandonedCartMail($user, $cartData));
    }
}
