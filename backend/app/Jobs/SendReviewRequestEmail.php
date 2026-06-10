<?php

namespace App\Jobs;

use App\Mail\ReviewRequestMail;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendReviewRequestEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [300, 900, 3600];

    public function __construct(public int $orderId)
    {
        $this->onQueue('emails');
    }

    public function handle(): void
    {
        $order = Order::with('items', 'user')->find($this->orderId);
        if (! $order || $order->status !== 'delivered') {
            return;
        }

        $email = $order->user?->email ?? ($order->shipping_address['email'] ?? null);
        if (! $email) {
            return;
        }

        Mail::to($email)->send(new ReviewRequestMail($order));
    }
}
