<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Endpoints are prefixed with /api automatically.
| Feature routes (auth, products, cart, checkout...) are added per phase.
*/

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'data' => ['name' => 'GiftCraft API', 'version' => '1.0'],
        'message' => 'GiftCraft Studio API is running',
    ]);
});

// Lightweight health check (expanded in Phase 1 — DB/Redis/Queue/Storage).
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'services' => ['app' => 'ok'],
    ]);
});
