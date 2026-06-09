<?php

namespace App\Http\Controllers\Api;

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
        $query = PortfolioProject::query()->orderBy('sort_order');

        if ($request->filled('occasion')) {
            $query->where('occasion', $request->query('occasion'));
        }
        if ($request->filled('industry')) {
            $query->where('industry', $request->query('industry'));
        }
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        return $this->success(PortfolioResource::collection($query->get()));
    }

    public function show(int $id): JsonResponse
    {
        $project = PortfolioProject::findOrFail($id);

        return $this->success(new PortfolioResource($project));
    }
}
