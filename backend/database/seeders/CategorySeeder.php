<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $tree = [
            [
                'name' => 'Quà tặng doanh nghiệp',
                'occasion_type' => 'corporate',
                'children' => ['Quà nhân viên', 'Quà đối tác', 'Quà sự kiện'],
            ],
            [
                'name' => 'Quà tặng cá nhân',
                'occasion_type' => 'birthday',
                'children' => ['Sinh nhật', 'Cưới hỏi', 'Khai trương'],
            ],
            [
                'name' => 'Bộ sưu tập theo mùa',
                'occasion_type' => 'holiday',
                'children' => ['New Collection 2025', 'Trung Thu', 'Tết'],
            ],
        ];

        $sort = 0;
        foreach ($tree as $parentData) {
            $parent = Category::updateOrCreate(
                ['slug' => Str::slug($parentData['name'])],
                [
                    'name' => $parentData['name'],
                    'occasion_type' => $parentData['occasion_type'],
                    'sort_order' => $sort++,
                    'is_active' => true,
                ]
            );

            $childSort = 0;
            foreach ($parentData['children'] as $childName) {
                Category::updateOrCreate(
                    ['slug' => Str::slug($childName)],
                    [
                        'name' => $childName,
                        'parent_id' => $parent->id,
                        'occasion_type' => $parentData['occasion_type'],
                        'sort_order' => $childSort++,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
