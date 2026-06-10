<x-mail::message>
# Bạn bỏ quên gì trong giỏ hàng rồi!

Xin chào **{{ $user->name }}**,

Bạn còn **{{ count($cart['items']) }} sản phẩm** đang chờ trong giỏ hàng, trị giá **{{ number_format($cart['subtotal'], 0, ',', '.') }}đ**.

<x-mail::table>
| Sản phẩm | Số lượng | Thành tiền |
|:---------|:--------:|-----------:|
@foreach($cart['items'] as $item)
| {{ $item['name'] }} | {{ $item['quantity'] }} | {{ number_format($item['line_total'], 0, ',', '.') }}đ |
@endforeach
</x-mail::table>

<x-mail::button :url="config('app.frontend_url') . '/gio-hang'">
Hoàn tất đơn hàng →
</x-mail::button>

Giỏ hàng sẽ được lưu trong 7 ngày. Đừng để những sản phẩm yêu thích của bạn bị người khác mua mất nhé!

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
