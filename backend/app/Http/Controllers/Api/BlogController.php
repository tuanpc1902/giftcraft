<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BlogController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $perPage  = $request->integer('per_page', 10);

        $posts = BlogPost::published()
            ->with('author:id,name')
            ->when($category, fn ($q) => $q->where('category', $category))
            ->orderByDesc('published_at')
            ->paginate($perPage);

        $items = collect($posts->items())->map(fn (BlogPost $p) => $this->formatListItem($p));

        return $this->success([
            'items' => $items,
            'meta'  => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'total'        => $posts->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = Cache::remember("blog:{$slug}", 300, function () use ($slug) {
            return BlogPost::published()->with('author:id,name')->where('slug', $slug)->firstOrFail();
        });

        return $this->success($this->formatDetail($post));
    }

    private function formatListItem(BlogPost $p): array
    {
        return [
            'id'          => $p->id,
            'title'       => $p->title,
            'slug'        => $p->slug,
            'excerpt'     => $p->excerpt,
            'cover_image' => $p->cover_image,
            'category'    => $p->category,
            'author'      => $p->author?->name ?? 'GiftCraft',
            'published_at' => $p->published_at?->toDateString(),
            'read_minutes' => $p->read_minutes,
        ];
    }

    private function formatDetail(BlogPost $p): array
    {
        return array_merge($this->formatListItem($p), [
            'content'          => $p->content,
            'meta_title'       => $p->meta_title ?? $p->title,
            'meta_description' => $p->meta_description ?? $p->excerpt,
        ]);
    }
}
