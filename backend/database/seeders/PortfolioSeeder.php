<?php

namespace Database\Seeders;

use App\Models\PortfolioProject;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            ['Quà Tết Vingroup 2025', 'Vingroup', 'Tết', 'Bất động sản', 500, true],
            ['Tri ân khách hàng FPT', 'FPT', 'Tri ân', 'Tech', 200, true],
            ['Khai trương Showroom Xe', 'VinFast', 'Khai trương', 'Retail', 150, true],
            ['Quà hội nghị Techcombank', 'Techcombank', 'Hội nghị', 'Tài chính', 300, false],
            ['Trung Thu cho nhân viên Shopee', 'Shopee', 'Trung Thu', 'Tech', 800, false],
            ['Quà cưới tập thể Grab', 'Grab', 'Cưới hỏi', 'Tech', 50, false],
            ['Tri ân đối tác Vinamilk', 'Vinamilk', 'Tri ân', 'F&B', 250, false],
            ['Quà sự kiện ra mắt Masan', 'Masan', 'Sự kiện', 'F&B', 400, false],
        ];

        foreach ($projects as $i => [$title, $client, $occasion, $industry, $quantity, $featured]) {
            PortfolioProject::updateOrCreate(
                ['title' => $title],
                [
                    'client_name' => $client,
                    'occasion' => $occasion,
                    'industry' => $industry,
                    'quantity' => $quantity,
                    'cover_image' => 'https://placehold.co/1200x800?text=' . urlencode($title),
                    'gallery_images' => [
                        'https://placehold.co/1200x800?text=' . urlencode($title . ' 1'),
                        'https://placehold.co/1200x800?text=' . urlencode($title . ' 2'),
                    ],
                    'description' => "Dự án {$occasion} cho {$client} — {$quantity} bộ quà được thiết kế riêng theo nhận diện thương hiệu.",
                    'is_featured' => $featured,
                    'sort_order' => $i,
                ]
            );
        }
    }
}
