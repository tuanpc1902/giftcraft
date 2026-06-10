<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly LoyaltyService $loyalty) {}

    public function summary(Request $request): JsonResponse
    {
        $summary = $this->loyalty->getSummary($request->user());

        return $this->success($summary);
    }
}
