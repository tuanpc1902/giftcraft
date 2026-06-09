<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse;

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['version'] = 1;

        $product = Product::create($data);
        $this->flushCaches();

        return $this->success(new ProductDetailResource($product->load('category')), 'Đã tạo sản phẩm', 201);
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        // Optimistic locking: reject stale writes.
        if ((int) $request->input('version') !== (int) $product->version) {
            return $this->error(
                'Sản phẩm đã được cập nhật bởi người khác. Vui lòng tải lại.',
                ['version' => ['version_mismatch']],
                409
            );
        }

        $data = $request->validated();
        unset($data['version']);
        $data['version'] = $product->version + 1;

        $product->update($data);
        $this->flushCaches($product->slug);

        return $this->success(new ProductDetailResource($product->fresh()->load('category')), 'Đã cập nhật');
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $slug = $product->slug;
        $product->delete(); // soft delete
        $this->flushCaches($slug);

        return $this->success(null, 'Đã xóa sản phẩm');
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $base . '-' . (++$i);
        }

        return $slug;
    }

    private function flushCaches(?string $slug = null): void
    {
        if ($slug) {
            Cache::forget("product:{$slug}");
        }
        // Product list cache keys are hashed; clear the store-wide list prefix pragmatically.
        Cache::flush();
    }
}
