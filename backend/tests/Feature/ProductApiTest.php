<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(array $attrs = []): Product
    {
        return Product::create(array_merge([
            'name' => 'Sản phẩm test',
            'slug' => 'sp-' . uniqid(),
            'retail_price' => 500000,
            'b2b_price_tiers' => [
                ['qty' => 20, 'price' => 450000],
                ['qty' => 50, 'price' => 425000],
                ['qty' => 100, 'price' => 400000],
                ['qty' => 200, 'price' => 375000],
                ['qty' => 300, 'price' => 350000],
            ],
            'stock_status' => 'in_stock',
            'weight_grams' => 500,
            'images' => ['https://example.com/a.jpg'],
            'is_active' => true,
        ], $attrs));
    }

    public function test_can_filter_products_by_category(): void
    {
        $cat = Category::create(['name' => 'Quà Tết', 'slug' => 'qua-tet', 'occasion_type' => 'holiday']);
        $other = Category::create(['name' => 'Sinh nhật', 'slug' => 'sinh-nhat', 'occasion_type' => 'birthday']);

        $this->makeProduct(['category_id' => $cat->id]);
        $this->makeProduct(['category_id' => $other->id]);

        $response = $this->getJson('/api/products?category=qua-tet');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data.items');
    }

    public function test_can_filter_products_by_price(): void
    {
        $this->makeProduct(['retail_price' => 300000]);
        $this->makeProduct(['retail_price' => 800000]);

        $response = $this->getJson('/api/products?min_price=500000&max_price=1000000');

        $response->assertOk()->assertJsonCount(1, 'data.items');
    }

    public function test_product_detail_has_five_b2b_tiers(): void
    {
        $product = $this->makeProduct(['slug' => 'bach-vi-van-hy']);

        $response = $this->getJson('/api/products/bach-vi-van-hy');

        $response->assertOk()
            ->assertJsonCount(5, 'data.b2b_price_tiers')
            ->assertJsonStructure(['data' => ['b2b_price_tiers' => [['qty_label', 'price', 'savings_percent']]]]);
    }

    public function test_admin_can_create_product_with_five_tiers(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $payload = [
            'name' => 'Quà mới',
            'retail_price' => 600000,
            'stock_status' => 'in_stock',
            'weight_grams' => 800,
            'b2b_price_tiers' => [
                ['qty' => 20, 'price' => 540000],
                ['qty' => 50, 'price' => 510000],
                ['qty' => 100, 'price' => 480000],
                ['qty' => 200, 'price' => 450000],
                ['qty' => 300, 'price' => 420000],
            ],
        ];

        $response = $this->actingAs($admin)->postJson('/api/admin/products', $payload);

        $response->assertCreated()->assertJsonCount(5, 'data.b2b_price_tiers');
        $this->assertDatabaseHas('products', ['name' => 'Quà mới', 'version' => 1]);
    }

    public function test_non_admin_cannot_create_product(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user)->postJson('/api/admin/products', ['name' => 'x']);

        $response->assertStatus(403);
    }

    public function test_categories_returns_nested_tree(): void
    {
        $parent = Category::create(['name' => 'Doanh nghiệp', 'slug' => 'doanh-nghiep', 'occasion_type' => 'corporate']);
        Category::create(['name' => 'Quà nhân viên', 'slug' => 'qua-nhan-vien', 'occasion_type' => 'corporate', 'parent_id' => $parent->id]);

        $response = $this->getJson('/api/categories');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonCount(1, 'data.0.children');
    }
}
