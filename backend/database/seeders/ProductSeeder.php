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

        $products = [
            [
                'name' => 'BÁCH VỊ VẠN HỶ',
                'short' => 'Hộp quà sum vầy trăm vị, gửi trọn lời chúc an khang.',
                'desc' => 'Bộ quà cao cấp với hơn 10 loại đặc sản Việt Nam được tuyển chọn kỹ lưỡng: mứt sen, trà Ô Long, hạt macca, bánh đậu xanh truyền thống và nhiều hơn nữa. Mỗi sản phẩm đều được đóng gói riêng, xếp gọn trong hộp gỗ thủ công sơn mài đỏ — sắc màu may mắn của dịp Tết. Phù hợp tặng sếp, đối tác, khách hàng VIP.',
                'seed' => 'bach-vi-van-hy',
            ],
            [
                'name' => 'Hương Quê',
                'short' => 'Tinh hoa đặc sản vùng miền trong một set quà mộc mạc.',
                'desc' => 'Set quà "Hương Quê" lấy cảm hứng từ những vùng đất nổi tiếng của Việt Nam: chè Thái Nguyên, cà phê Đắk Lắk, mắm ruốc Huế, bánh tráng Trảng Bàng. Bao bì thiết kế theo phong cách mộc mạc với giấy kraft tái chế, in hoa văn thổ cẩm. Một món quà gửi đi cả hồn Việt.',
                'seed' => 'huong-que',
            ],
            [
                'name' => 'Tinh Khôi',
                'short' => 'Set quà thanh lịch tông trắng, dành cho khởi đầu mới.',
                'desc' => 'Thiết kế tông trắng ngà tối giản — phong cách Nhật Bản gặp tinh tế Việt. Bộ quà gồm: nến thơm hoa trà, xà phòng handmade, tinh dầu thiên nhiên và hộp trà sen Tây Hồ. Thích hợp cho khai trương, ra mắt sản phẩm, hoặc tặng đối tác mới. Hộp thiếc khắc logo theo yêu cầu.',
                'seed' => 'tinh-khoi',
            ],
            [
                'name' => 'Lộc Phát Tài',
                'short' => 'Quà Tết may mắn với sắc đỏ vàng rực rỡ.',
                'desc' => 'Hộp quà Tết truyền thống với màu đỏ-vàng kiêu sa, chứa đựng những sản phẩm tượng trưng cho may mắn và thịnh vượng: bánh pía, mứt dừa, rượu gạo Làng Vân, hạt sen sấy khô và phong bao lì xì in logo. Thiết kế riêng cho từng doanh nghiệp từ 100 bộ trở lên.',
                'seed' => 'loc-phat-tai',
            ],
            [
                'name' => 'An Nhiên',
                'short' => 'Bộ quà trà thảo mộc thư giãn cho ngày bình yên.',
                'desc' => 'Bộ sưu tập trà thảo mộc thuần Việt: trà atiso Đà Lạt, trà gừng mật ong, trà lá sen, trà hoa cúc — tất cả trong hũ thủy tinh sang trọng đặt trên khay gỗ tràm. Kèm theo: muỗng gỗ và bookmark thư pháp. Quà tặng dành cho người yêu sức khỏe và sự tĩnh tâm.',
                'seed' => 'an-nhien',
            ],
            [
                'name' => 'Thịnh Vượng',
                'short' => 'Hộp quà doanh nghiệp sang trọng, khẳng định đẳng cấp.',
                'desc' => 'Flagship product của GiftCraft Studio — bộ quà dành cho CEO, đối tác chiến lược và khách hàng VIP. Hộp da cao cấp đựng: rượu vang đỏ Đà Lạt, set bút ký, túi thơm nước hoa và bộ danh thiếp khắc laser. Có thể thêm thư cảm ơn viết tay theo yêu cầu. Giao hàng trong vòng 24h.',
                'seed' => 'thinh-vuong',
            ],
            [
                'name' => 'Ngọt Ngào',
                'short' => 'Set bánh ngọt thủ công cho dịp sinh nhật đáng nhớ.',
                'desc' => 'Hộp bánh ngọt thủ công "Ngọt Ngào" gồm 12 loại bánh làm từ nguyên liệu tự nhiên: macaron, financier, cookie bơ, bánh trung thu mini, madeleine chanh. Không chất bảo quản, không màu nhân tạo. Bao bì hộp kính thanh lịch có thể tái sử dụng. Có thể in tên và lời chúc lên hộp.',
                'seed' => 'ngot-ngao',
            ],
            [
                'name' => 'Vạn Sự Như Ý',
                'short' => 'Quà tri ân khách hàng với lời chúc trọn vẹn.',
                'desc' => 'Bộ quà tri ân được thiết kế với thông điệp "Vạn Sự Như Ý" — gửi lời cảm ơn chân thành đến những người đã đồng hành. Gồm: ấm trà gốm Bát Tràng, hộp trà Ô Long cao cấp, khung ảnh gỗ và bookmark thư pháp đồng. Mỗi bộ đều kèm card chúc mừng viết tay cá nhân hóa.',
                'seed' => 'van-su-nhu-y',
            ],
            [
                'name' => 'Sắc Xuân',
                'short' => 'Bộ sưu tập Tết tươi mới, đậm hương vị truyền thống.',
                'desc' => 'Bộ sưu tập Tết "Sắc Xuân" mang màu sắc của mùa hoa mai nở — vàng nhạt, trắng ngà và xanh lá. Bao gồm: bánh chưng mini hút chân không, mứt gừng, hạt dưa rang muối, trà ướp hoa nhài và khăn thêu hình hoa mai. Sang trọng mà vẫn gần gũi — dành cho mọi đối tượng.',
                'seed' => 'sac-xuan',
            ],
            [
                'name' => 'Trọn Tình',
                'short' => 'Hộp quà cưới tinh tế gửi gắm yêu thương.',
                'desc' => 'Set quà cưới "Trọn Tình" dành riêng cho các cặp đôi muốn tặng kỷ niệm ý nghĩa. Gồm: 2 ly thủy tinh khắc tên, nến hình trái tim, vòng hoa khô và hộp chocolate handmade. Thiết kế theo bộ màu hồng-trắng-vàng. Có thể tùy chỉnh nội dung theo yêu cầu từ 20 bộ trở lên.',
                'seed' => 'tron-tinh',
            ],
            [
                'name' => 'Khởi Sắc',
                'short' => 'Quà khai trương hồng phát, chúc buôn may bán đắt.',
                'desc' => 'Bộ quà khai trương mang ý nghĩa khởi đầu tươi sáng: bình hoa giả nghệ thuật, đèn tealight thơm, cây phú quý mini và biểu ngữ chúc mừng bằng gỗ. Màu sắc tươi tắn, phù hợp trưng bày tại cửa hàng sau khi mở hộp. Giao hàng hỏa tốc trong ngày cho TP.HCM và Hà Nội.',
                'seed' => 'khoi-sac',
            ],
            [
                'name' => 'Đoàn Viên',
                'short' => 'Set quà Trung Thu sum họp dưới ánh trăng rằm.',
                'desc' => 'Hộp quà Trung Thu "Đoàn Viên" được thiết kế theo chủ đề ánh trăng: hộp thiếc hình tròn màu xanh navy, chứa 4 bánh trung thu cao cấp (nhân sen, đậu xanh, thập cẩm, matcha), 2 đèn lồng giấy và 1 ly trà sữa hoàng trà. Phù hợp tặng gia đình, đối tác và nhân viên.',
                'seed' => 'doan-vien',
            ],
            [
                'name' => 'Phúc Lộc Thọ',
                'short' => 'Bộ ba lời chúc kinh điển trong một hộp quà cao cấp.',
                'desc' => 'Ba phúc lành kinh điển của người Việt — Phúc, Lộc, Thọ — được thể hiện qua ba tầng hộp quà sang trọng. Tầng 1: Sức khỏe (trà thảo mộc, mật ong rừng). Tầng 2: Thịnh vượng (rượu gạo, bánh đặc sản). Tầng 3: May mắn (nến thơm, vật phẩm phong thủy). Phù hợp tặng người lớn tuổi, quan chức, đối tác.',
                'seed' => 'phuc-loc-tho',
            ],
            [
                'name' => 'Hạnh Phúc',
                'short' => 'Quà tặng ấm áp cho người thân yêu.',
                'desc' => 'Set quà "Hạnh Phúc" được thiết kế với một ý nghĩa giản dị: gửi trao yêu thương. Gồm: 2 hũ mứt hoa quả handmade, hộp cookie bơ, khăn lau tay thêu hoa và thiệp viết tay. Bao bì vải canvas tái sử dụng. Thích hợp cho sinh nhật, kỷ niệm, hoặc đơn giản là muốn nói "Tôi quan tâm đến bạn".',
                'seed' => 'hanh-phuc',
            ],
            [
                'name' => 'Tâm Giao',
                'short' => 'Set quà đối tác thể hiện sự trân trọng dài lâu.',
                'desc' => 'Dành riêng cho mối quan hệ đối tác bền vững — hộp quà "Tâm Giao" mang thông điệp của sự tin tưởng và hợp tác lâu dài. Gồm: set văn phòng phẩm cao cấp (sổ da, bút Parker), hộp trà ướp sen và khung kính khắc logo công ty. Có thể tùy chỉnh thiệp với chữ ký CEO.',
                'seed' => 'tam-giao',
            ],
            [
                'name' => 'Mộc Lan',
                'short' => 'Quà tặng hương thơm thiên nhiên dịu nhẹ.',
                'desc' => 'Lấy cảm hứng từ loài hoa mộc lan thanh khiết, bộ quà gồm: nước hoa dạng xịt phòng (hương hoa trắng), diffuser tinh dầu tràm trà, xà phòng hoa mộc lan và túi thơm phòng. Đóng gói trong hộp thiếc vintage với họa tiết hoa lá. Thích hợp tặng các chị em phụ nữ và phòng làm việc.',
                'seed' => 'moc-lan',
            ],
            [
                'name' => 'Kim Ngân',
                'short' => 'Hộp quà ánh kim sang trọng cho sự kiện trọng đại.',
                'desc' => 'Phong cách xa hoa với sắc vàng-đồng ánh kim — hộp quà "Kim Ngân" dành cho các dịp đặc biệt quan trọng: lễ kỷ niệm 10 năm, IPO, ra mắt thương hiệu. Gồm: champagne Việt Nam cao cấp, caviar snack, chocolate Bỉ, và vật kỷ niệm bằng đồng khắc ngày tháng. Đóng gói trong hộp velvet.',
                'seed' => 'kim-ngan',
            ],
            [
                'name' => 'Bình An',
                'short' => 'Set quà sức khỏe gửi lời chúc an lành.',
                'desc' => 'Bộ quà chăm sóc sức khỏe thuần thiên nhiên: mật ong nguyên chất Mèo Vạc, yến sào chưng đường phèn (6 hũ), hạt chia, hạt óc chó và trà dưỡng sinh. Đi kèm sách nhỏ "365 ngày sống khỏe" do GiftCraft biên soạn. Thích hợp tặng người lớn tuổi, sếp, và người bệnh cần bồi dưỡng.',
                'seed' => 'binh-an',
            ],
            [
                'name' => 'Như Ngọc',
                'short' => 'Quà tặng tinh xảo như viên ngọc quý.',
                'desc' => 'Bộ quà mỹ phẩm thuần Việt cao cấp: serum vitamin C chiết xuất từ bưởi, kem dưỡng da hoa hồng Đà Lạt, mặt nạ đất sét và son dưỡng môi sáp ong. Tất cả đều là sản phẩm thuần chay, không paraben, không silicon. Đóng hộp kính sang trọng với ruy-băng lụa. Phù hợp tặng chị em phụ nữ.',
                'seed' => 'nhu-ngoc',
            ],
            [
                'name' => 'Thanh Tao',
                'short' => 'Bộ quà trà đạo thanh lịch cho người sành.',
                'desc' => 'Set trà đạo cao cấp cho những tâm hồn yêu vẻ đẹp tĩnh lặng: ấm Tử Sa Bát Tràng, 3 loại trà thượng hạng (Ô Long Đài Loan, Pu-erh Vân Nam, Trắng Mao Phong), khay tre và bộ dụng cụ pha trà 6 món. Đóng gói trong hộp gỗ có ngăn đựng, mở ra như cuốn sách — ấn tượng ngay từ cái nhìn đầu tiên.',
                'seed' => 'thanh-tao',
            ],
            [
                'name' => 'Rạng Đông',
                'short' => 'Quà tặng năng lượng tích cực cho ngày mới.',
                'desc' => 'Hộp quà buổi sáng tràn đầy năng lượng: cà phê nguyên chất Cầu Đất (Đà Lạt), granola handmade, mật ong chanh dây, ly sứ in hình bình minh và sổ tay 365 ngày. Thiết kế màu vàng-cam ấm áp. Phù hợp tặng đồng nghiệp, nhân viên mới hoặc người bạn cần động lực.',
                'seed' => 'rang-dong',
            ],
            [
                'name' => 'Viên Mãn',
                'short' => 'Hộp quà tròn đầy cho dịp đoàn tụ.',
                'desc' => 'Hộp quà hình tròn — biểu tượng của sự tròn đầy và trọn vẹn — chứa đựng những hương vị gia đình: bánh bía sen dừa, kẹo dừa Bến Tre, mứt tắc, trà gừng và đặc biệt là album ảnh gia đình mini có thể tùy chỉnh. Một món quà nói lên điều mà lời nói không diễn đạt được.',
                'seed' => 'vien-man',
            ],
            [
                'name' => 'Hỷ Sự',
                'short' => 'Set quà chúc mừng hỷ sự trọn niềm vui.',
                'desc' => 'Bộ quà dành riêng cho các dịp vui mừng: thôi nôi, đầy tháng, thăng chức. Thiết kế phong cách pastel vui tươi, gồm: bánh kem mini, nước chanh muối, bong bóng trang trí mini và thiệp pop-up 3D. Kèm sticker tùy chỉnh in tên và ngày kỷ niệm. Giao nhanh 2h trong nội thành.',
                'seed' => 'hy-su',
            ],
            [
                'name' => 'Cát Tường',
                'short' => 'Quà tặng may mắn cho khởi đầu thuận lợi.',
                'desc' => 'Set quà phong thủy hiện đại: cây may mắn đa nhục (succulent), hũ muối xông phòng, nến khắc tên theo yêu cầu và cuốn sách thiền định. Không mê tín — chỉ đơn giản là những vật phẩm giúp không gian sống thêm tươi mát và tinh thần thêm tích cực. Phù hợp cho văn phòng, phòng ngủ, phòng học.',
                'seed' => 'cat-tuong',
            ],
            [
                'name' => 'Phồn Vinh',
                'short' => 'Hộp quà doanh nghiệp biểu trưng cho sự phát triển.',
                'desc' => 'Flagship bộ sưu tập doanh nghiệp — "Phồn Vinh" thể hiện tầm nhìn và sự phát triển bền vững. Gồm: bộ sách kinh doanh bestseller (3 cuốn), planner da cao cấp, bình giữ nhiệt khắc logo, cà phê specialty và voucher workshop kỹ năng lãnh đạo. Dành cho CEO, giám đốc và nhà quản lý cấp cao.',
                'seed' => 'phon-vinh',
            ],
        ];

        foreach ($products as $i => $p) {
            $retail = (int) (round(rand(310000, 1100000) / 5000) * 5000);

            $tiers = [
                ['qty' => 20,  'price' => $this->tierPrice($retail, 0.90)],
                ['qty' => 50,  'price' => $this->tierPrice($retail, 0.85)],
                ['qty' => 100, 'price' => $this->tierPrice($retail, 0.80)],
                ['qty' => 200, 'price' => $this->tierPrice($retail, 0.75)],
                ['qty' => 300, 'price' => $this->tierPrice($retail, 0.70)],
            ];

            $slug = Str::slug($p['name']) . '-' . ($i + 1);
            $seed = $p['seed'];

            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'name'              => $p['name'],
                    'description'       => $p['desc'],
                    'short_description' => $p['short'],
                    'retail_price'      => $retail,
                    'b2b_price_tiers'   => $tiers,
                    'stock_status'      => $i % 8 === 7 ? 'pre_order' : 'in_stock',
                    'weight_grams'      => rand(300, 2000),
                    'sku'               => 'GC-' . str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                    'images'            => [
                        "https://picsum.photos/seed/{$seed}/800/800",
                        "https://picsum.photos/seed/{$seed}-2/800/800",
                        "https://picsum.photos/seed/{$seed}-3/800/800",
                    ],
                    'is_active'         => true,
                    'is_customizable'   => ($i % 10) < 7,
                    'category_id'       => $childCategoryIds[array_rand($childCategoryIds)] ?? null,
                    'meta_title'        => $p['name'] . ' — Quà tặng GiftCraft Studio',
                    'meta_description'  => $p['short'],
                ]
            );
        }
    }

    private function tierPrice(int $retail, float $factor): int
    {
        return (int) (round(($retail * $factor) / 1000) * 1000);
    }
}
