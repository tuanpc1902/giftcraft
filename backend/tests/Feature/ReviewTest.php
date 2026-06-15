<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(array $attrs = []): Product
    {
        return Product::create(array_merge([
            'name'             => 'Quà Test',
            'slug'             => 'qua-test-' . uniqid(),
            'retail_price'     => 350000,
            'b2b_price_tiers'  => [['qty' => 20, 'price' => 300000]],
            'stock_status'     => 'in_stock',
            'weight_grams'     => 500,
            'images'           => ['https://example.com/img.jpg'],
            'is_active'        => true,
        ], $attrs));
    }

    private function makeUser(): User
    {
        return User::factory()->create();
    }

    /** GET /api/products/{slug}/reviews — public */
    public function test_can_list_approved_reviews_for_product(): void
    {
        $product = $this->makeProduct(['slug' => 'qua-tet-hop-hoa']);
        $user    = $this->makeUser();

        Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 5,
            'body'       => 'Sản phẩm rất đẹp và chắc chắn.',
            'status'     => 'approved',
        ]);

        // Pending review should NOT appear
        Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 3,
            'body'       => 'Bình thường thôi, đang chờ duyệt.',
            'status'     => 'pending',
        ]);

        $response = $this->getJson("/api/products/qua-tet-hop-hoa/reviews");

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.rating', 5);
    }

    public function test_returns_empty_list_for_product_with_no_reviews(): void
    {
        $this->makeProduct(['slug' => 'san-pham-moi-ra']);

        $response = $this->getJson('/api/products/san-pham-moi-ra/reviews');

        $response->assertOk()
            ->assertJsonPath('data.items', [])
            ->assertJsonPath('data.meta.total', 0);
    }

    public function test_returns_404_for_unknown_product(): void
    {
        $this->getJson('/api/products/khong-ton-tai/reviews')->assertNotFound();
    }

    /** POST /api/products/{slug}/reviews — auth required */
    public function test_authenticated_user_can_submit_review(): void
    {
        $product = $this->makeProduct(['slug' => 'hop-qua-cao-cap']);
        $user    = $this->makeUser();

        $response = $this->actingAs($user)->postJson("/api/products/hop-qua-cao-cap/reviews", [
            'rating' => 4,
            'title'  => 'Rất hài lòng',
            'body'   => 'Đóng gói cẩn thận, giao hàng nhanh, sản phẩm đẹp.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('reviews', [
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 4,
            'status'     => 'pending',
        ]);
    }

    public function test_review_is_marked_verified_purchase_when_user_has_delivered_order(): void
    {
        $product = $this->makeProduct(['slug' => 'goi-qua-doanh-nghiep']);
        $user    = $this->makeUser();

        $order = Order::create([
            'user_id'          => $user->id,
            'order_number'     => 'GC-20260101-00001',
            'status'           => 'delivered',
            'payment_status'   => 'paid',
            'shipping_address' => ['name' => 'Test', 'phone' => '0900000000', 'address' => 'HCM', 'city' => 'HCM', 'district' => 'Q1'],
            'subtotal'         => 350000,
            'shipping_fee'     => 30000,
            'discount'         => 0,
            'total'            => 380000,
        ]);

        OrderItem::create([
            'order_id'         => $order->id,
            'product_id'       => $product->id,
            'quantity'         => 1,
            'unit_price'       => 350000,
            'total_price'      => 350000,
            'product_snapshot' => ['name' => $product->name, 'slug' => $product->slug, 'image' => null, 'sku' => null],
        ]);

        $this->actingAs($user)->postJson("/api/products/goi-qua-doanh-nghiep/reviews", [
            'rating' => 5,
            'body'   => 'Mua về rất thích, đóng gói chuyên nghiệp.',
        ]);

        $this->assertDatabaseHas('reviews', [
            'user_id'              => $user->id,
            'product_id'           => $product->id,
            'is_verified_purchase' => true,
        ]);
    }

    public function test_user_cannot_review_same_product_twice(): void
    {
        $product = $this->makeProduct(['slug' => 'goi-tao-thuong-hang']);
        $user    = $this->makeUser();

        Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 5,
            'body'       => 'Lần đầu đánh giá.',
            'status'     => 'approved',
        ]);

        $response = $this->actingAs($user)->postJson("/api/products/goi-tao-thuong-hang/reviews", [
            'rating' => 3,
            'body'   => 'Thử đánh giá lần hai.',
        ]);

        $response->assertStatus(422);
    }

    public function test_guest_cannot_submit_review(): void
    {
        $this->makeProduct(['slug' => 'den-long-thu-cong']);

        $this->postJson('/api/products/den-long-thu-cong/reviews', [
            'rating' => 5,
            'body'   => 'Rất đẹp.',
        ])->assertUnauthorized();
    }

    public function test_review_body_must_be_at_least_10_chars(): void
    {
        $this->makeProduct(['slug' => 'qua-sinh-nhat-dep']);
        $user = $this->makeUser();

        $this->actingAs($user)->postJson('/api/products/qua-sinh-nhat-dep/reviews', [
            'rating' => 4,
            'body'   => 'Ngắn.',
        ])->assertUnprocessable();
    }

    /** POST /api/reviews/{id}/helpful */
    public function test_can_mark_approved_review_as_helpful(): void
    {
        $product = $this->makeProduct();
        $user    = $this->makeUser();

        $review = Review::create([
            'user_id'       => $user->id,
            'product_id'    => $product->id,
            'rating'        => 5,
            'body'          => 'Rất tuyệt vời, đóng gói đẹp.',
            'status'        => 'approved',
            'helpful_count' => 2,
        ]);

        $this->actingAs($user)->postJson("/api/reviews/{$review->id}/helpful")
            ->assertOk()
            ->assertJsonPath('data.helpful_count', 3);

        $this->assertDatabaseHas('reviews', ['id' => $review->id, 'helpful_count' => 3]);
    }

    public function test_cannot_mark_pending_review_as_helpful(): void
    {
        $product = $this->makeProduct();
        $user    = $this->makeUser();

        $review = Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 4,
            'body'       => 'Đang chờ duyệt.',
            'status'     => 'pending',
        ]);

        $this->actingAs($user)->postJson("/api/reviews/{$review->id}/helpful")
            ->assertNotFound();
    }

    /** Admin endpoints */
    public function test_admin_can_approve_review(): void
    {
        $admin   = User::factory()->create(['role' => 'admin']);
        $product = $this->makeProduct();
        $user    = $this->makeUser();

        $review = Review::create([
            'user_id'    => $user->id,
            'product_id' => $product->id,
            'rating'     => 5,
            'body'       => 'Đang chờ admin duyệt.',
            'status'     => 'pending',
        ]);

        $this->actingAs($admin)->putJson("/api/admin/reviews/{$review->id}", [
            'status' => 'approved',
        ])->assertOk();

        $this->assertDatabaseHas('reviews', ['id' => $review->id, 'status' => 'approved']);
    }

    public function test_admin_can_list_reviews_filtered_by_status(): void
    {
        $admin   = User::factory()->create(['role' => 'admin']);
        $product = $this->makeProduct();
        $user    = $this->makeUser();

        Review::create(['user_id' => $user->id, 'product_id' => $product->id, 'rating' => 5, 'body' => 'Chờ duyệt số 1.', 'status' => 'pending']);
        Review::create(['user_id' => $user->id, 'product_id' => $product->id, 'rating' => 4, 'body' => 'Đã duyệt.', 'status' => 'approved']);

        $response = $this->actingAs($admin)->getJson('/api/admin/reviews?status=pending');

        $response->assertOk()->assertJsonCount(1, 'data.items');
    }
}
