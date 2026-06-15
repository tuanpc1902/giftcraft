<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::take(12)->get();
        if ($products->isEmpty()) return;

        $admin = User::where('role', 'admin')->first();
        if (! $admin) return;

        $reviewData = [
            [5, 'Quà tặng hoàn hảo', 'Đặt cho công ty tặng đối tác dịp cuối năm. Hộp rất sang, đóng gói chắc chắn, giao hàng đúng hẹn. Đối tác khen liên tục. Năm sau sẽ đặt lại!'],
            [5, 'Vượt kỳ vọng', 'Mình đã từng đặt quà từ nhiều nơi nhưng GiftCraft thực sự khác biệt. Từng chi tiết nhỏ đều được chú ý — từ cách xếp sản phẩm trong hộp đến tấm thiệp viết tay. Cảm ơn team!'],
            [4, 'Chất lượng tốt, giao hơi chậm', 'Sản phẩm rất đẹp và chất lượng cao hơn giá tiền. Chỉ tiếc là giao hàng trễ hơn dự kiến 1 ngày. Tuy nhiên vẫn sẽ đặt lại vì sản phẩm xứng đáng.'],
            [5, 'Đối tác rất thích', 'Tặng 50 bộ cho đối tác B2B. Nhận được phản hồi tích cực từ 90% người nhận. Một số người còn gọi điện hỏi mua thêm. Đây là loại marketing hiệu quả nhất!'],
            [4, 'Đẹp, chuyên nghiệp', 'Bao bì thiết kế rất đẹp, in logo sắc nét. Sản phẩm bên trong chất lượng tốt. Mình đặt 100 bộ, giá B2B rất hợp lý. Chỉ cần cải thiện thêm tốc độ phản hồi email.'],
            [5, 'Xuất sắc!', 'Tuyệt vời từ đầu đến cuối. Team tư vấn nhiệt tình, thiết kế đúng yêu cầu ngay lần đầu, giao hàng sớm hơn deadline. Sẽ giới thiệu cho bạn bè và đồng nghiệp.'],
            [3, 'Khá tốt nhưng cần cải thiện', 'Sản phẩm đẹp nhưng một trong số 20 hộp bị móp góc khi nhận. Team đã đổi lại ngay không phí thêm nhưng khiến mình lo lắng về khâu đóng gói vận chuyển.'],
            [5, 'Mua lần 3 rồi vẫn hài lòng', 'Đây là lần thứ 3 mình đặt quà từ GiftCraft. Chất lượng ổn định, không bao giờ thất vọng. Giá cả minh bạch, không phát sinh chi phí ẩn.'],
            [5, 'Quà Tết hoàn hảo cho doanh nghiệp', 'Năm nay đặt 200 bộ quà Tết. Được discount 25% rất hợp lý. Hộp thiết kế riêng theo màu thương hiệu, in logo cực đẹp. BGĐ khen ngay khi thấy sản phẩm!'],
            [4, 'Ấn tượng với khâu tư vấn', 'Team sale rất am hiểu sản phẩm và tư vấn đúng nhu cầu, không cố bán đắt. Đặt 30 bộ cho team nhỏ, thiết kế vừa đẹp vừa tiết kiệm.'],
            [5, 'Giao nhanh, chất lượng ổn định', 'Đặt hàng lúc 10h sáng, 3h chiều cùng ngày đã nhận hàng (nội thành HCM). Hộp đẹp, sản phẩm nguyên vẹn. Sẽ là địa chỉ tin cậy cho mọi dịp lễ.'],
            [5, 'Nhân viên rất hài lòng', 'Tặng nhân viên dịp 8/3. Hầu hết comment trên group công ty. Ai cũng khen hộp đẹp và sản phẩm ngon. Đây là lần đầu tặng quà mà không nhận được ý kiến "bình thường quá"!'],
            [4, 'Giá trị xứng đáng', 'Giá không rẻ nhưng đúng với chất lượng. Khi so sánh với các đơn vị khác cùng phân khúc thì GiftCraft vẫn là lựa chọn tốt hơn về thiết kế và dịch vụ.'],
            [5, 'Đặt cho sự kiện khai trương', 'Cần 80 hộp gấp cho khai trương, team GiftCraft hỗ trợ làm trong 5 ngày. Kết quả vượt mong đợi — khách đến dự sự kiện ai cũng chia sẻ ảnh hộp quà lên mạng xã hội!'],
            [5, 'Chuyên nghiệp và đáng tin', 'Đã hợp tác với GiftCraft 2 năm liên tục. Chưa bao giờ thất vọng. Đây là đơn vị làm quà tặng doanh nghiệp uy tín nhất mình từng gặp.'],
            [3, 'Sản phẩm tốt, bảo hành cần cải thiện', 'Hộp quà đẹp nhưng 1 sản phẩm bên trong bị rò. Liên hệ hỗ trợ mất 30 phút mới có người trả lời. Cần cải thiện thời gian phản hồi.'],
            [5, 'Thiết kế đúng gu', 'Mô tả yêu cầu, team thiết kế ra mẫu rất đúng gu, không phải sửa lần nào. Tiết kiệm thời gian và công sức cho HR nhiều lắm.'],
            [4, 'Hài lòng 80%', 'Sản phẩm đẹp, đúng như ảnh website. Trừ đi 1 sao vì giao hàng hơi trễ so với cam kết ban đầu. Nhưng đối với chất lượng thì hoàn toàn xứng đáng.'],
            [5, 'Quà Trung Thu năm nay xuất sắc', 'Đặt 150 hộp Trung Thu. Thiết kế hộp đặc biệt đẹp, bánh ngon (không khô, không ngọt quá). Nhiều đối tác nhắn tin khen ngợi. 5 sao không đủ!'],
            [5, 'Đơn vị đáng tin cậy nhất', 'Sau nhiều năm tìm kiếm, cuối cùng tìm được đơn vị làm quà tặng doanh nghiệp vừa đẹp vừa đáng tin. GiftCraft là lựa chọn cuối cùng và duy nhất từ giờ trở đi.'],
        ];

        $productList = $products->values();
        $reviewCount = count($reviewData);

        foreach ($reviewData as $i => [$rating, $title, $body]) {
            $product = $productList[$i % $productList->count()];

            Review::updateOrCreate(
                ['user_id' => $admin->id, 'product_id' => $product->id, 'title' => $title],
                [
                    'user_id'              => $admin->id,
                    'product_id'           => $product->id,
                    'rating'               => $rating,
                    'title'                => $title,
                    'body'                 => $body,
                    'status'               => 'approved',
                    'is_verified_purchase' => $i % 3 !== 0,
                    'helpful_count'        => rand(0, 42),
                ]
            );
        }
    }
}
