<?php

namespace App\Jobs;

use App\Mail\OrderStatusMail;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendOrderStatusUpdate implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [60, 300, 900];

    public function __construct(public int $orderId, public string $status)
    {
        $this->onQueue('emails');
    }

    public function handle(): void
    {
        $order = Order::with('items', 'user')->find($this->orderId);
        if (! $order) {
            return;
        }

        $email = $order->user?->email ?? ($order->shipping_address['email'] ?? null);
        if (! $email) {
            return;
        }

        Mail::to($email)->send(new OrderStatusMail($order, $this->status));
    }
}
