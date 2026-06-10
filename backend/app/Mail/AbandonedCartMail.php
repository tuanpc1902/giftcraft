<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AbandonedCartMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public array $cart) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bạn còn sản phẩm trong giỏ hàng — GiftCraft Studio',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.cart.abandoned',
            with: [
                'user' => $this->user,
                'cart' => $this->cart,
            ],
        );
    }
}
