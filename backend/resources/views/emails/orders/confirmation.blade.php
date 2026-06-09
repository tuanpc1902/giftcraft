@php($addr = $order->shipping_address)
<x-mail::message>
# Cảm ơn bạn đã đặt hàng! 🎁

Đơn hàng **{{ $order->order_number }}** của bạn đã được tiếp nhận.

<x-mail::table>
| Sản phẩm | SL | Thành tiền |
|:---------|:--:|-----------:|
@foreach ($order->items as $item)
| {{ $item->product_snapshot['name'] ?? 'Sản phẩm' }} | {{ $item->quantity }} | {{ number_format($item->total_price, 0, ',', '.') }}đ |
@endforeach
</x-mail::table>

**Tạm tính:** {{ number_format($order->subtotal, 0, ',', '.') }}đ
@if ($order->discount_amount > 0)
**Giảm giá:** -{{ number_format($order->discount_amount, 0, ',', '.') }}đ
@endif
**Phí vận chuyển:** {{ number_format($order->shipping_fee, 0, ',', '.') }}đ
**Tổng cộng:** **{{ number_format($order->total, 0, ',', '.') }}đ**

---

**Giao đến:** {{ $addr['name'] ?? '' }} — {{ $addr['phone'] ?? '' }}
{{ $addr['address'] ?? '' }}, {{ $addr['ward'] ?? '' }}, {{ $addr['district'] ?? '' }}, {{ $addr['city'] ?? '' }}

**Hình thức giao:** {{ $order->delivery_type === 'express' ? 'Hỏa tốc' : 'Tiêu chuẩn' }}
@if ($order->gift_message)
**Lời nhắn thiệp:** _{{ $order->gift_message }}_
@endif

<x-mail::button :url="config('app.frontend_url', config('app.url')) . '/don-hang/' . $order->order_number">
Theo dõi đơn hàng
</x-mail::button>

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
