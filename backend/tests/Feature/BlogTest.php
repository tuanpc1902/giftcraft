<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogTest extends TestCase
{
    use RefreshDatabase;

    private ?User $author = null;

    private function author(): User
    {
        return $this->author ??= User::factory()->create();
    }

    private function makePublishedPost(array $attrs = []): BlogPost
    {
        return BlogPost::create(array_merge([
            'author_id'    => $this->author()->id,
            'title'        => 'Xu hướng quà tặng 2026',
            'slug'         => 'xu-huong-qua-tang-' . uniqid(),
            'excerpt'      => 'Tóm tắt bài viết về xu hướng quà tặng.',
            'content'      => '<p>Nội dung đầy đủ về xu hướng quà tặng năm 2026.</p>',
            'category'     => 'Xu hướng quà tặng',
            'read_minutes' => 5,
            'status'       => 'published',
            'published_at' => now()->subHour(),
        ], $attrs));
    }

    private function makeDraftPost(array $attrs = []): BlogPost
    {
        return BlogPost::create(array_merge([
            'author_id'    => $this->author()->id,
            'title'        => 'Bài nháp chưa đăng',
            'slug'         => 'bai-nhap-' . uniqid(),
            'excerpt'      => 'Bài viết này chưa được đăng.',
            'content'      => '<p>Nội dung nháp.</p>',
            'category'     => 'Bí quyết B2B',
            'read_minutes' => 3,
            'status'       => 'draft',
            'published_at' => null,
        ], $attrs));
    }

    /** GET /api/blog */
    public function test_returns_published_posts_only(): void
    {
        $this->makePublishedPost();
        $this->makePublishedPost();
        $this->makeDraftPost();

        $response = $this->getJson('/api/blog');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data.items');
    }

    public function test_returns_empty_list_when_no_published_posts(): void
    {
        $this->makeDraftPost();

        $response = $this->getJson('/api/blog');

        $response->assertOk()
            ->assertJsonPath('data.items', [])
            ->assertJsonPath('data.meta.total', 0);
    }

    public function test_can_filter_by_category(): void
    {
        $this->makePublishedPost(['category' => 'Xu hướng quà tặng']);
        $this->makePublishedPost(['category' => 'Bí quyết B2B']);
        $this->makePublishedPost(['category' => 'Bí quyết B2B']);

        $response = $this->getJson('/api/blog?category=' . urlencode('Bí quyết B2B'));

        $response->assertOk()->assertJsonCount(2, 'data.items');
    }

    public function test_list_response_has_required_fields(): void
    {
        $this->makePublishedPost(['slug' => 'bai-viet-co-du-truong']);

        $response = $this->getJson('/api/blog');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'items' => [
                        ['id', 'title', 'slug', 'excerpt', 'category', 'read_minutes', 'published_at'],
                    ],
                    'meta' => ['current_page', 'last_page', 'total'],
                ],
            ]);
    }

    public function test_posts_are_ordered_newest_first(): void
    {
        $older = $this->makePublishedPost(['slug' => 'bai-cu', 'published_at' => now()->subDays(5)]);
        $newer = $this->makePublishedPost(['slug' => 'bai-moi', 'published_at' => now()->subHour()]);

        $response = $this->getJson('/api/blog');

        $items = $response->json('data.items');
        $this->assertEquals($newer->id, $items[0]['id']);
        $this->assertEquals($older->id, $items[1]['id']);
    }

    /** GET /api/blog/{slug} */
    public function test_can_get_published_post_detail(): void
    {
        $this->makePublishedPost(['slug' => 'xu-huong-qua-trung-thu-2026']);

        $response = $this->getJson('/api/blog/xu-huong-qua-trung-thu-2026');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'slug', 'content', 'meta_title', 'meta_description'],
            ]);
    }

    public function test_post_detail_includes_content(): void
    {
        $this->makePublishedPost([
            'slug'    => 'bai-co-noi-dung',
            'content' => '<p>Nội dung HTML đầy đủ của bài viết.</p>',
        ]);

        $response = $this->getJson('/api/blog/bai-co-noi-dung');

        $response->assertOk()
            ->assertJsonPath('data.content', '<p>Nội dung HTML đầy đủ của bài viết.</p>');
    }

    public function test_returns_404_for_draft_post(): void
    {
        $this->makeDraftPost(['slug' => 'bai-nhap-bi-mat']);

        $this->getJson('/api/blog/bai-nhap-bi-mat')->assertNotFound();
    }

    public function test_returns_404_for_nonexistent_post(): void
    {
        $this->getJson('/api/blog/khong-co-bai-nay')->assertNotFound();
    }

    /** Admin endpoints */
    public function test_admin_can_create_blog_post(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/api/admin/blog', [
            'title'        => 'Bài viết mới từ admin',
            'excerpt'      => 'Tóm tắt nội dung bài viết mới.',
            'content'      => '<p>Nội dung chi tiết.</p>',
            'category'     => 'Xu hướng quà tặng',
            'read_minutes' => 4,
            'status'       => 'published',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('blog_posts', ['title' => 'Bài viết mới từ admin']);
    }

    public function test_admin_can_list_all_posts_including_drafts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->makePublishedPost();
        $this->makeDraftPost();

        $response = $this->actingAs($admin)->getJson('/api/admin/blog');

        $response->assertOk()
            ->assertJsonCount(2, 'data.items');
    }

    public function test_admin_can_update_post_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $post  = $this->makeDraftPost(['slug' => 'bai-can-dang']);

        $this->actingAs($admin)->putJson("/api/admin/blog/{$post->id}", [
            'title'        => $post->title,
            'content'      => $post->content,
            'status'       => 'published',
            'category'     => $post->category,
            'read_minutes' => $post->read_minutes,
        ])->assertOk();

        $this->assertDatabaseHas('blog_posts', ['id' => $post->id, 'status' => 'published']);
    }

    public function test_admin_can_delete_post(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $post  = $this->makePublishedPost();

        $this->actingAs($admin)->deleteJson("/api/admin/blog/{$post->id}")
            ->assertOk();

        $this->assertSoftDeleted('blog_posts', ['id' => $post->id]);
    }

    public function test_non_admin_cannot_access_admin_blog(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $this->actingAs($user)->getJson('/api/admin/blog')
            ->assertForbidden();
    }
}
