<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order, public string $newStatus)
    {
    }

    public function envelope(): Envelope
    {
        $labels = [
            'confirmed' => 'đã được xác nhận',
            'processing' => 'đang được xử lý',
            'shipped' => 'đang được giao',
            'delivered' => 'đã giao thành công',
            'cancelled' => 'đã bị hủy',
        ];
        $label = $labels[$this->newStatus] ?? $this->newStatus;

        return new Envelope(
            subject: "Đơn hàng {$this->order->order_number} {$label} — GiftCraft Studio",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.status',
            with: ['order' => $this->order, 'newStatus' => $this->newStatus],
        );
    }
}
