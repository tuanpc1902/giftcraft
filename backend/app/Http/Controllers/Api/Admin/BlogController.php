<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $posts = BlogPost::with('author:id,name')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->query('status')))
            ->orderByDesc('created_at')
            ->paginate(20);

        return $this->success([
            'items' => $posts->items(),
            'meta'  => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'total'        => $posts->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);

        $post = BlogPost::create(array_merge($data, [
            'author_id'    => $request->user()->id,
            'slug'         => $data['slug'] ?? Str::slug($data['title']),
            'published_at' => $data['status'] === 'published' ? now() : null,
        ]));

        return $this->success($post, 'Đã tạo bài viết', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $data = $this->validated($request, $post->id);

        if ($data['status'] === 'published' && ! $post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);
        Cache::forget("blog:{$post->slug}");

        return $this->success($post, 'Đã cập nhật bài viết');
    }

    public function destroy(int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        Cache::forget("blog:{$post->slug}");
        $post->delete();

        return $this->success(null, 'Đã xóa bài viết');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title'            => ['required', 'string', 'max:200'],
            'slug'             => ['nullable', 'string', 'max:200', "unique:blog_posts,slug,{$ignoreId}"],
            'excerpt'          => ['nullable', 'string', 'max:500'],
            'content'          => ['required', 'string'],
            'cover_image'      => ['nullable', 'string', 'max:500'],
            'category'         => ['required', 'string', 'max:100'],
            'read_minutes'     => ['nullable', 'integer', 'min:1', 'max:60'],
            'status'           => ['required', 'in:draft,published'],
            'meta_title'       => ['nullable', 'string', 'max:200'],
            'meta_description' => ['nullable', 'string', 'max:300'],
        ]);
    }
}
