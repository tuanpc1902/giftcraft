<?php

namespace Tests\Feature;

use App\Jobs\SendOrderConfirmationEmail;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Redis::connection()->flushdb();
        Http::fake(); // never hit the real GHN API during tests (falls back to flat-rate)
    }

    private function product(array $attrs = []): Product
    {
        return Product::create(array_merge([
            'name' => 'Quà test',
            'slug' => 'sp-' . uniqid(),
            'retail_price' => 250000,
            'stock_status' => 'in_stock',
            'weight_grams' => 500,
            'images' => ['x.jpg'],
            'is_active' => true,
        ], $attrs));
    }

    private function checkoutPayload(): array
    {
        return [
            'shipping_address' => [
                'name' => 'Trần B', 'phone' => '0909999999',
                'address' => '12 Lê Lợi', 'ward' => 'Bến Nghé',
                'district' => 'Quận 1', 'city' => 'TP.HCM',
            ],
            'delivery_type' => 'standard',
            'gift_message' => 'Chúc mừng sinh nhật',
            'customer_note' => 'Giao giờ hành chính',
            'payment_method' => 'cod',
        ];
    }

    private function headers(string $idem): array
    {
        return ['X-Session-ID' => 'sess-checkout', 'Idempotency-Key' => $idem];
    }

    public function test_cod_checkout_creates_confirmed_order(): void
    {
        Queue::fake();
        $p = $this->product(['retail_price' => 300000, 'weight_grams' => 600]);

        $this->withHeaders(['X-Session-ID' => 'sess-checkout'])
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 2]);

        $response = $this->withHeaders($this->headers('idem-1'))
            ->postJson('/api/orders/checkout', $this->checkoutPayload());

        $response->assertCreated()
            ->assertJsonPath('data.status', 'confirmed')
            ->assertJsonStructure(['data' => ['order_number', 'status']]);

        $this->assertDatabaseHas('orders', [
            'status' => 'confirmed',
            'payment_method' => 'cod',
            'delivery_type' => 'standard',
            'gift_message' => 'Chúc mừng sinh nhật',
            'subtotal' => 600000,
        ]);
        $this->assertDatabaseCount('order_items', 1);
        Queue::assertPushed(SendOrderConfirmationEmail::class);
    }

    public function test_checkout_is_idempotent(): void
    {
        Queue::fake();
        $p = $this->product();

        $this->withHeaders(['X-Session-ID' => 'sess-checkout'])
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 1]);

        $first = $this->withHeaders($this->headers('idem-same'))
            ->postJson('/api/orders/checkout', $this->checkoutPayload());
        $first->assertCreated();
        $orderNumber = $first->json('data.order_number');

        // Replay with the same Idempotency-Key → same order, no duplicate.
        $second = $this->withHeaders($this->headers('idem-same'))
            ->postJson('/api/orders/checkout', $this->checkoutPayload());

        $second->assertCreated()->assertJsonPath('data.order_number', $orderNumber);
        $this->assertDatabaseCount('orders', 1);
    }

    public function test_checkout_requires_idempotency_key(): void
    {
        $p = $this->product();
        $this->withHeaders(['X-Session-ID' => 'sess-checkout'])
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 1]);

        $response = $this->withHeaders(['X-Session-ID' => 'sess-checkout'])
            ->postJson('/api/orders/checkout', $this->checkoutPayload());

        $response->assertStatus(422);
    }

    public function test_can_poll_order_by_number(): void
    {
        Queue::fake();
        $p = $this->product();
        $this->withHeaders(['X-Session-ID' => 'sess-checkout'])
            ->postJson('/api/cart/items', ['product_id' => $p->id, 'quantity' => 1]);
        $res = $this->withHeaders($this->headers('idem-poll'))
            ->postJson('/api/orders/checkout', $this->checkoutPayload());
        $num = $res->json('data.order_number');

        $this->getJson("/api/orders/{$num}")
            ->assertOk()
            ->assertJsonPath('data.order_number', $num)
            ->assertJsonPath('data.payment_status', 'pending');
    }
}
