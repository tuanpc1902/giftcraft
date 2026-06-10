<x-mail::message>
# Cảm ơn bạn đã mua hàng!

Xin chào **{{ $order->shipping_address['name'] ?? 'bạn' }}**,

Đơn hàng **{{ $order->order_number }}** của bạn đã được giao thành công. Chúng tôi rất mong nhận được đánh giá của bạn về sản phẩm!

<x-mail::button :url="config('app.frontend_url') . '/san-pham'">
Đánh giá ngay
</x-mail::button>

Đánh giá của bạn giúp chúng tôi cải thiện sản phẩm và giúp những khách hàng khác có lựa chọn tốt hơn.

Cảm ơn bạn đã tin tưởng GiftCraft Studio!

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
