<?php

namespace Tests\Feature;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    /** GET /api/loyalty/summary — auth required */
    public function test_guest_cannot_access_loyalty_summary(): void
    {
        $this->getJson('/api/loyalty/summary')->assertUnauthorized();
    }

    public function test_new_user_starts_with_zero_points_and_silver_tier(): void
    {
        $user = User::factory()->create([
            'loyalty_points' => 0,
            'loyalty_tier'   => 'silver',
        ]);

        $response = $this->actingAs($user)->getJson('/api/loyalty/summary');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.points', 0)
            ->assertJsonPath('data.tier', 'silver')
            ->assertJsonPath('data.transactions', []);
    }

    public function test_summary_includes_next_tier_info_for_silver_user(): void
    {
        $user = User::factory()->create([
            'loyalty_points' => 100,
            'loyalty_tier'   => 'silver',
        ]);

        $response = $this->actingAs($user)->getJson('/api/loyalty/summary');

        $response->assertOk()
            ->assertJsonPath('data.next_tier.tier', 'gold')
            ->assertJsonPath('data.next_tier.required', 500)
            ->assertJsonPath('data.next_tier.remaining', 400);
    }

    public function test_summary_includes_next_tier_info_for_gold_user(): void
    {
        $user = User::factory()->create([
            'loyalty_points' => 600,
            'loyalty_tier'   => 'gold',
        ]);

        $response = $this->actingAs($user)->getJson('/api/loyalty/summary');

        $response->assertOk()
            ->assertJsonPath('data.next_tier.tier', 'diamond')
            ->assertJsonPath('data.next_tier.required', 2000)
            ->assertJsonPath('data.next_tier.remaining', 1400);
    }

    public function test_diamond_user_has_no_next_tier(): void
    {
        $user = User::factory()->create([
            'loyalty_points' => 2500,
            'loyalty_tier'   => 'diamond',
        ]);

        $response = $this->actingAs($user)->getJson('/api/loyalty/summary');

        $response->assertOk()
            ->assertJsonPath('data.next_tier', null);
    }

    public function test_summary_includes_recent_transactions(): void
    {
        $user = User::factory()->create([
            'loyalty_points' => 150,
            'loyalty_tier'   => 'silver',
        ]);

        LoyaltyTransaction::create([
            'user_id'       => $user->id,
            'order_id'      => null,
            'type'          => 'earn',
            'points'        => 50,
            'balance_after' => 50,
            'description'   => 'Tích điểm từ đơn hàng #GC-20260601-00001',
        ]);

        LoyaltyTransaction::create([
            'user_id'       => $user->id,
            'order_id'      => null,
            'type'          => 'earn',
            'points'        => 100,
            'balance_after' => 150,
            'description'   => 'Tích điểm từ đơn hàng #GC-20260602-00001',
        ]);

        $response = $this->actingAs($user)->getJson('/api/loyalty/summary');

        $response->assertOk()
            ->assertJsonCount(2, 'data.transactions')
            ->assertJsonPath('data.points', 150);
    }

    public function test_summary_response_has_required_structure(): void
    {
        $user = User::factory()->create(['loyalty_points' => 0, 'loyalty_tier' => 'silver']);

        $this->actingAs($user)->getJson('/api/loyalty/summary')
            ->assertOk()
            ->assertJsonStructure([
                'data' => ['points', 'tier', 'next_tier', 'transactions'],
            ]);
    }
}
