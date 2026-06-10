<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\SupplierApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    use ApiResponse;

    public function apply(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_name'       => ['required', 'string', 'max:255'],
            'tax_code'           => ['required', 'string', 'max:50'],
            'contact_name'       => ['required', 'string', 'max:255'],
            'phone'              => ['required', 'string', 'max:20'],
            'email'              => ['required', 'email', 'max:255'],
            'product_types'      => ['required', 'string', 'max:2000'],
            'has_vat_invoice'    => ['boolean'],
            'min_order_quantity' => ['nullable', 'integer', 'min:1'],
            'description'        => ['nullable', 'string', 'max:3000'],
        ]);

        $data['status'] = 'new';
        $app = SupplierApplication::create($data);

        return $this->success(['id' => $app->id], 'Đơn đăng ký nhà cung cấp đã được ghi nhận', 201);
    }

    // Admin
    public function adminIndex(Request $request): JsonResponse
    {
        $query = SupplierApplication::orderByDesc('created_at');
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $items = $query->paginate(30);

        return $this->success([
            'items' => $items->items(),
            'meta'  => [
                'current_page' => $items->currentPage(),
                'last_page'    => $items->lastPage(),
                'total'        => $items->total(),
            ],
        ]);
    }

    public function adminUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,reviewing,approved,rejected'],
        ]);

        $app = SupplierApplication::findOrFail($id);
        $app->update($data);

        return $this->success($app, 'Đã cập nhật');
    }
}
