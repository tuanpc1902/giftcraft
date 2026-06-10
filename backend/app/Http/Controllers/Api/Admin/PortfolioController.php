<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioResource;
use App\Models\PortfolioProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $projects = PortfolioProject::query()
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 50));

        return $this->success([
            'items' => PortfolioResource::collection($projects->items()),
            'meta'  => [
                'current_page' => $projects->currentPage(),
                'last_page'    => $projects->lastPage(),
                'total'        => $projects->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'client_name'    => ['nullable', 'string', 'max:255'],
            'occasion'       => ['required', 'string', 'max:100'],
            'industry'       => ['nullable', 'string', 'max:100'],
            'quantity'       => ['nullable', 'integer', 'min:1'],
            'cover_image'    => ['required', 'string', 'max:500'],
            'gallery_images' => ['sometimes', 'array'],
            'gallery_images.*' => ['string', 'max:500'],
            'description'    => ['nullable', 'string', 'max:2000'],
            'is_featured'    => ['sometimes', 'boolean'],
            'sort_order'     => ['sometimes', 'integer', 'min:0'],
        ]);

        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['gallery_images'] = $data['gallery_images'] ?? [];

        $project = PortfolioProject::create($data);

        return $this->success(new PortfolioResource($project), 'Đã thêm dự án', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = PortfolioProject::findOrFail($id);

        $data = $request->validate([
            'title'          => ['sometimes', 'string', 'max:255'],
            'client_name'    => ['nullable', 'string', 'max:255'],
            'occasion'       => ['sometimes', 'string', 'max:100'],
            'industry'       => ['nullable', 'string', 'max:100'],
            'quantity'       => ['nullable', 'integer', 'min:1'],
            'cover_image'    => ['sometimes', 'string', 'max:500'],
            'gallery_images' => ['sometimes', 'array'],
            'gallery_images.*' => ['string', 'max:500'],
            'description'    => ['nullable', 'string', 'max:2000'],
            'is_featured'    => ['sometimes', 'boolean'],
            'sort_order'     => ['sometimes', 'integer', 'min:0'],
        ]);

        $project->update($data);

        return $this->success(new PortfolioResource($project->fresh()), 'Đã cập nhật');
    }

    public function destroy(int $id): JsonResponse
    {
        PortfolioProject::findOrFail($id)->delete();

        return $this->success(null, 'Đã xóa dự án');
    }
}
