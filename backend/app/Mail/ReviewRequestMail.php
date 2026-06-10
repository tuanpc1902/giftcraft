<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Đánh giá sản phẩm — GiftCraft Studio',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.reviews.request',
            with: ['order' => $this->order],
        );
    }
}
