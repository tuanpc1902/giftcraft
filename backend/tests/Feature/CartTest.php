<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Redis::connection()->flushdb(); // isolated test redis db
    }

    private function product(array $attrs = []): Product
    {
        return Product::create(array_merge([
            'name' => 'SP',
            'slug' => 'sp-' . uniqid(),
            'retail_price' => 200000,
            'stock_status' => 'in_stock',
            'weight_grams' => 400,
            'images' => ['x.jpg'],
            'is_active' => true,
        ], $attrs));
    }

    private function guestHeaders(): array
    {
        return ['X-Session-ID' => 'test-session-123'];
    }

    public function test_guest_can_add_item_to_cart(): void
    {
        $p = $this->product(['retail_price' => 300000]);

        $response = $this->withHeaders($this->guestHeaders())
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 2]);

        $response->assertOk()
            ->assertJsonPath('data.subtotal', 600000)
            ->assertJsonPath('data.total_items', 2)
            ->assertJsonCount(1, 'data.items');
    }

    public function test_cannot_add_out_of_stock_product(): void
    {
        $p = $this->product(['stock_status' => 'out_of_stock']);

        $response = $this->withHeaders($this->guestHeaders())
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 1]);

        $response->assertStatus(422);
    }

    public function test_guest_cart_requires_session_header(): void
    {
        $p = $this->product();

        $response = $this->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 1]);

        $response->assertStatus(400);
    }

    public function test_apply_percent_voucher_previews_discount(): void
    {
        $p = $this->product(['retail_price' => 500000]);
        Voucher::create([
            'code' => 'SALE10', 'type' => 'percent', 'value' => 10, 'min_order_amount' => 0,
        ]);

        $this->withHeaders($this->guestHeaders())
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 2]);

        $response = $this->withHeaders($this->guestHeaders())
            ->postJson('/api/cart/apply-voucher', ['code' => 'SALE10']);

        $response->assertOk()
            ->assertJsonPath('data.discount_amount', 100000) // 10% of 1,000,000
            ->assertJsonPath('data.voucher.code', 'SALE10');
    }

    public function test_shipping_calculate_returns_standard_and_express_for_hcm(): void
    {
        $p = $this->product(['weight_grams' => 600]);
        $this->withHeaders($this->guestHeaders())
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 1]);

        $response = $this->withHeaders($this->guestHeaders())
            ->postJson('/api/shipping/calculate', [
                'address' => ['city' => 'TP.HCM', 'district' => 'Quận 1'],
                'delivery_type' => 'express',
            ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['standard' => ['fee', 'estimated_days'], 'express' => ['fee', 'estimated_days', 'note']]]);
    }
}
