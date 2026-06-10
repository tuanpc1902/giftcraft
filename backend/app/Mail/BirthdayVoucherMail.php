<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BirthdayVoucherMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public Voucher $voucher) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Chúc mừng sinh nhật! Quà tặng từ GiftCraft Studio',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.loyalty.birthday',
            with: [
                'user'    => $this->user,
                'voucher' => $this->voucher,
            ],
        );
    }
}
