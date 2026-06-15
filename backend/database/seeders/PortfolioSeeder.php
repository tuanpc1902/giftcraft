<?php

namespace Database\Seeders;

use App\Models\PortfolioProject;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title'       => 'Quà Tết Vingroup 2025',
                'client'      => 'Vingroup',
                'occasion'    => 'Tết',
                'industry'    => 'Bất động sản',
                'quantity'    => 500,
                'featured'    => true,
                'seed'        => 'vingroup-tet',
                'description' => '500 bộ quà Tết cao cấp cho nhân viên và đối tác Vingroup — thiết kế theo bộ nhận diện thương hiệu xanh-vàng đặc trưng. Mỗi hộp gồm 12 sản phẩm đặc sản vùng miền, đóng trong hộp gỗ khắc laser logo. Hoàn thành trong 3 tuần, giao đúng hạn trước 23 tháng Chạp.',
            ],
            [
                'title'       => 'Tri ân khách hàng FPT Telecom',
                'client'      => 'FPT Telecom',
                'occasion'    => 'Tri ân',
                'industry'    => 'Viễn thông',
                'quantity'    => 200,
                'featured'    => true,
                'seed'        => 'fpt-tri-an',
                'description' => 'Chiến dịch tri ân khách hàng thân thiết FPT Telecom nhân kỷ niệm 20 năm thành lập. 200 set quà premium với thiết kế riêng, bao gồm bình giữ nhiệt, sổ tay da và cà phê specialty. Mỗi hộp kèm thư cảm ơn viết tay từ CEO.',
            ],
            [
                'title'       => 'Khai trương Showroom VinFast',
                'client'      => 'VinFast',
                'occasion'    => 'Khai trương',
                'industry'    => 'Ô tô',
                'quantity'    => 150,
                'featured'    => true,
                'seed'        => 'vinfast-khai-truong',
                'description' => 'Bộ quà khai trương đặc biệt cho sự kiện ra mắt showroom VinFast tại 3 tỉnh thành. Thiết kế tông xanh-trắng theo brand identity, mỗi set gồm nến thơm, diffuser và túi tote canvas in logo. Giao hàng đồng loạt trong 1 ngày cho 3 địa điểm.',
            ],
            [
                'title'       => 'Hội nghị thường niên Techcombank',
                'client'      => 'Techcombank',
                'occasion'    => 'Hội nghị',
                'industry'    => 'Tài chính',
                'quantity'    => 300,
                'featured'    => false,
                'seed'        => 'techcombank-hoi-nghi',
                'description' => 'Bộ quà hội nghị thường niên cho 300 cổ đông và nhà đầu tư chiến lược Techcombank. Thiết kế sang trọng với hộp da màu đỏ đô — màu thương hiệu ngân hàng, gồm planner da, bút ký và set trà thảo mộc cao cấp.',
            ],
            [
                'title'       => 'Trung Thu nhân viên Shopee',
                'client'      => 'Shopee',
                'occasion'    => 'Trung Thu',
                'industry'    => 'Thương mại điện tử',
                'quantity'    => 800,
                'featured'    => false,
                'seed'        => 'shopee-trung-thu',
                'description' => 'Dự án lớn nhất của GiftCraft trong năm 2024: 800 hộp bánh Trung Thu cho toàn bộ nhân viên Shopee Việt Nam. Thiết kế hộp theo màu cam thương hiệu Shopee với họa tiết thỏ ngọc. Sản xuất và đóng gói trong 2 tuần, vận chuyển đến 5 văn phòng trên cả nước.',
            ],
            [
                'title'       => 'Quà cưới tập thể Grab Vietnam',
                'client'      => 'Grab Vietnam',
                'occasion'    => 'Cưới hỏi',
                'industry'    => 'Công nghệ',
                'quantity'    => 50,
                'featured'    => false,
                'seed'        => 'grab-cuoi',
                'description' => 'Chương trình quà cưới đặc biệt cho các cặp đôi Grabber đăng ký kết hôn trong năm 2024. 50 set quà cưới cao cấp với thiết kế xanh-trắng Grab, gồm ly thủy tinh khắc tên, nến hình trái tim và album ảnh mini.',
            ],
            [
                'title'       => 'Tri ân đối tác Vinamilk',
                'client'      => 'Vinamilk',
                'occasion'    => 'Tri ân',
                'industry'    => 'Thực phẩm & Đồ uống',
                'quantity'    => 250,
                'featured'    => false,
                'seed'        => 'vinamilk-doi-tac',
                'description' => 'Bộ quà tri ân 250 đối tác phân phối lớn nhất của Vinamilk trên toàn quốc. Thiết kế đặc biệt với hộp thiếc hình lon sữa vintage, bên trong là set đặc sản Việt Nam cao cấp. Mỗi hộp kèm chứng nhận đối tác vàng được đóng khung.',
            ],
            [
                'title'       => 'Ra mắt sản phẩm mới Masan',
                'client'      => 'Masan Group',
                'occasion'    => 'Sự kiện',
                'industry'    => 'Hàng tiêu dùng',
                'quantity'    => 400,
                'featured'    => false,
                'seed'        => 'masan-ra-mat',
                'description' => 'Bộ quà cho sự kiện ra mắt dòng sản phẩm mới của Masan — 400 set tặng nhà báo, KOL và đối tác bán lẻ. Hộp thiết kế theo concept "Tươi Mới", màu xanh ngọc tươi tắn, kèm miniature sản phẩm Masan mới ra mắt và card thư mời.',
            ],
        ];

        foreach ($projects as $i => $p) {
            $seed = $p['seed'];
            PortfolioProject::updateOrCreate(
                ['title' => $p['title']],
                [
                    'client_name'    => $p['client'],
                    'occasion'       => $p['occasion'],
                    'industry'       => $p['industry'],
                    'quantity'       => $p['quantity'],
                    'cover_image'    => "https://picsum.photos/seed/{$seed}/1200/800",
                    'gallery_images' => [
                        "https://picsum.photos/seed/{$seed}-a/1200/800",
                        "https://picsum.photos/seed/{$seed}-b/1200/800",
                        "https://picsum.photos/seed/{$seed}-c/800/800",
                    ],
                    'description'    => $p['description'],
                    'is_featured'    => $p['featured'],
                    'sort_order'     => $i,
                ]
            );
        }
    }
}
