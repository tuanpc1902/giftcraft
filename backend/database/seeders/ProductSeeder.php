<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $childCategoryIds = Category::whereNotNull('parent_id')->pluck('id')->all();

        // Creative Vietnamese gift names with short storytelling.
        $names = [
            ['BÁCH VỊ VẠN HỶ', 'Hộp quà sum vầy trăm vị, gửi trọn lời chúc an khang.'],
            ['Hương Quê', 'Tinh hoa đặc sản vùng miền trong một set quà mộc mạc.'],
            ['Tinh Khôi', 'Set quà thanh lịch tông trắng, dành cho khởi đầu mới.'],
            ['Lộc Phát Tài', 'Quà Tết may mắn với sắc đỏ vàng rực rỡ.'],
            ['An Nhiên', 'Bộ quà trà thảo mộc thư giãn cho ngày bình yên.'],
            ['Thịnh Vượng', 'Hộp quà doanh nghiệp sang trọng, khẳng định đẳng cấp.'],
            ['Ngọt Ngào', 'Set bánh ngọt thủ công cho dịp sinh nhật đáng nhớ.'],
            ['Vạn Sự Như Ý', 'Quà tri ân khách hàng với lời chúc trọn vẹn.'],
            ['Sắc Xuân', 'Bộ sưu tập Tết tươi mới, đậm hương vị truyền thống.'],
            ['Trọn Tình', 'Hộp quà cưới tinh tế gửi gắm yêu thương.'],
            ['Khởi Sắc', 'Quà khai trương hồng phát, chúc buôn may bán đắt.'],
            ['Đoàn Viên', 'Set quà Trung Thu sum họp dưới ánh trăng rằm.'],
            ['Phúc Lộc Thọ', 'Bộ ba lời chúc kinh điển trong một hộp quà cao cấp.'],
            ['Hạnh Phúc', 'Quà tặng ấm áp cho người thân yêu.'],
            ['Tâm Giao', 'Set quà đối tác thể hiện sự trân trọng dài lâu.'],
            ['Mộc Lan', 'Quà tặng hương thơm thiên nhiên dịu nhẹ.'],
            ['Kim Ngân', 'Hộp quà ánh kim sang trọng cho sự kiện trọng đại.'],
            ['Bình An', 'Set quà sức khỏe gửi lời chúc an lành.'],
            ['Như Ngọc', 'Quà tặng tinh xảo như viên ngọc quý.'],
            ['Thanh Tao', 'Bộ quà trà đạo thanh lịch cho người sành.'],
            ['Rạng Đông', 'Quà tặng năng lượng tích cực cho ngày mới.'],
            ['Viên Mãn', 'Hộp quà tròn đầy cho dịp đoàn tụ.'],
            ['Hỷ Sự', 'Set quà chúc mừng hỷ sự trọn niềm vui.'],
            ['Cát Tường', 'Quà tặng may mắn cho khởi đầu thuận lợi.'],
            ['Phồn Vinh', 'Hộp quà doanh nghiệp biểu trưng cho sự phát triển.'],
        ];

        foreach ($names as $i => [$name, $story]) {
            // Retail price 310k–1,100k, rounded to nearest 5,000.
            $retail = (int) (round(rand(310000, 1100000) / 5000) * 5000);

            $tiers = [
                ['qty' => 20, 'price' => $this->tierPrice($retail, 0.90)],
                ['qty' => 50, 'price' => $this->tierPrice($retail, 0.85)],
                ['qty' => 100, 'price' => $this->tierPrice($retail, 0.80)],
                ['qty' => 200, 'price' => $this->tierPrice($retail, 0.75)],
                ['qty' => 300, 'price' => $this->tierPrice($retail, 0.70)],
            ];

            $slug = Str::slug($name) . '-' . ($i + 1);

            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $story . ' Sản phẩm được chế tác thủ công, đóng gói tỉ mỉ, phù hợp làm quà tặng trong mọi dịp.',
                    'short_description' => $story,
                    'retail_price' => $retail,
                    'b2b_price_tiers' => $tiers,
                    'stock_status' => 'in_stock',
                    'weight_grams' => rand(300, 2000),
                    'sku' => 'GC-' . str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                    'images' => [
                        'https://placehold.co/800x800?text=' . urlencode($name),
                    ],
                    'is_active' => true,
                    'is_customizable' => ($i % 10) < 6, // ~60% customizable
                    'category_id' => $childCategoryIds[array_rand($childCategoryIds)] ?? null,
                    'meta_title' => $name . ' — Quà tặng GiftCraft Studio',
                    'meta_description' => $story,
                ]
            );
        }
    }

    private function tierPrice(int $retail, float $factor): int
    {
        return (int) (round(($retail * $factor) / 1000) * 1000);
    }
}
