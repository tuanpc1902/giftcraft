@php
$labels = [
    'confirmed' => 'đã được xác nhận',
    'processing' => 'đang được xử lý',
    'shipped' => 'đang trên đường giao đến bạn',
    'delivered' => 'đã giao thành công',
    'cancelled' => 'đã bị hủy',
];
$label = $labels[$newStatus] ?? $newStatus;
@endphp
<x-mail::message>
# Cập nhật đơn hàng {{ $order->order_number }}

Đơn hàng của bạn **{{ $label }}**.

@if ($newStatus === 'shipped')
Bạn có thể theo dõi hành trình giao hàng qua nút bên dưới.
@elseif ($newStatus === 'delivered')
Cảm ơn bạn đã mua sắm tại {{ config('app.name') }}! Hãy để lại đánh giá nếu bạn hài lòng nhé.
@endif

<x-mail::button :url="config('app.frontend_url', config('app.url')) . '/don-hang/' . $order->order_number">
Xem chi tiết đơn hàng
</x-mail::button>

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
