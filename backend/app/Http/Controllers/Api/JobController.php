<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    use ApiResponse;

    public function apply(Request $request): JsonResponse
    {
        $data = $request->validate([
            'job_title'      => ['required', 'string', 'max:255'],
            'applicant_name' => ['required', 'string', 'max:255'],
            'phone'          => ['required', 'string', 'max:20'],
            'email'          => ['required', 'email', 'max:255'],
            'cv_url'         => ['required', 'string', 'url', 'max:500'],
            'cover_letter'   => ['nullable', 'string', 'max:3000'],
        ]);

        $data['status'] = 'new';
        $app = JobApplication::create($data);

        return $this->success(['id' => $app->id], 'Đơn ứng tuyển đã được ghi nhận', 201);
    }

    // Admin
    public function adminIndex(Request $request): JsonResponse
    {
        $query = JobApplication::orderByDesc('created_at');
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('job_title')) {
            $query->where('job_title', $request->query('job_title'));
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
            'status' => ['required', 'in:new,reviewing,interviewed,hired,rejected'],
        ]);

        $app = JobApplication::findOrFail($id);
        $app->update($data);

        return $this->success($app, 'Đã cập nhật');
    }
}
