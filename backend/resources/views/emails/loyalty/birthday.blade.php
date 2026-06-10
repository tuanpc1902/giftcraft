<x-mail::message>
# Chúc mừng sinh nhật, {{ $user->name }}! 🎂

GiftCraft Studio gửi tặng bạn **voucher sinh nhật** đặc biệt:

<x-mail::panel>
**Mã giảm giá:** `{{ $voucher->code }}`

Giảm **{{ $voucher->value }}%** cho đơn hàng từ {{ number_format($voucher->min_order_amount, 0, ',', '.') }}đ

Tối đa giảm {{ number_format($voucher->max_discount, 0, ',', '.') }}đ

Hết hạn: {{ $voucher->expires_at?->format('d/m/Y') }}
</x-mail::panel>

<x-mail::button :url="config('app.frontend_url') . '/san-pham'">
Mua sắm ngay
</x-mail::button>

Chúc bạn một ngày sinh nhật thật vui vẻ và hạnh phúc!

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
