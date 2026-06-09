<?php

use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\B2bQuoteController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ShippingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Endpoints are prefixed with /api automatically.
| Feature routes (auth, products, cart, checkout...) are added per phase.
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// --- Catalogue (public) ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio/{id}', [PortfolioController::class, 'show'])->whereNumber('id');

// --- Cart (works for guest via X-Session-ID, or authed user) ---
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/items', [CartController::class, 'addItem']);
    Route::put('/items/{productId}', [CartController::class, 'updateItem'])->whereNumber('productId');
    Route::delete('/items/{productId}', [CartController::class, 'removeItem'])->whereNumber('productId');
    Route::delete('/', [CartController::class, 'clear']);
    Route::post('/apply-voucher', [CartController::class, 'applyVoucher']);
    Route::post('/remove-voucher', [CartController::class, 'removeVoucher']);
});

// --- Shipping fee calculator ---
Route::post('/shipping/calculate', [ShippingController::class, 'calculate']);

// --- B2B Quotes ---
Route::post('/b2b/quotes', [B2bQuoteController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/b2b/quotes', [B2bQuoteController::class, 'index']);
    Route::get('/b2b/quotes/{id}', [B2bQuoteController::class, 'show'])->whereNumber('id');
});

// --- Checkout & orders ---
Route::post('/orders/checkout', [CheckoutController::class, 'checkout']);
Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
Route::middleware('auth:sanctum')->get('/orders', [OrderController::class, 'index']);

// --- Payment gateways (callbacks + IPN) ---
Route::get('/payment/vnpay/callback', [PaymentController::class, 'vnpayCallback']);
Route::post('/payment/vnpay/ipn', [PaymentController::class, 'vnpayIpn']);
Route::get('/payment/momo/callback', [PaymentController::class, 'momoCallback']);
Route::post('/payment/momo/ipn', [PaymentController::class, 'momoIpn']);

// --- Admin catalogue management ---
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->whereNumber('id');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->whereNumber('id');
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->whereNumber('id');
    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::get('/b2b/quotes', [B2bQuoteController::class, 'adminIndex']);
    Route::put('/b2b/quotes/{id}', [B2bQuoteController::class, 'adminUpdate'])->whereNumber('id');

    // Dashboard stats (placeholder returns zeros — fleshed out Phase 2)
    Route::get('/stats', function () {
        $today = now()->startOfDay();
        return response()->json(['success' => true, 'data' => [
            'today_revenue' => (int) \App\Models\Order::where('created_at', '>=', $today)->sum('total'),
            'pending_orders' => \App\Models\Order::where('status', 'pending')->count(),
            'express_orders' => \App\Models\Order::where('status', 'pending')->where('delivery_type', 'express')->count(),
            'new_b2b_quotes' => 0, // Phase 2
        ]]);
    });
});

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'data' => ['name' => 'GiftCraft API', 'version' => '1.0'],
        'message' => 'GiftCraft Studio API is running',
    ]);
});

// Health check — used by smoke tests in deploy.sh
Route::get('/health', function () {
    $services = [];
    $overall = 'ok';

    // Database
    try {
        \Illuminate\Support\Facades\DB::select('SELECT 1');
        $services['database'] = 'ok';
    } catch (\Throwable) {
        $services['database'] = 'error';
        $overall = 'degraded';
    }

    // Redis
    try {
        \Illuminate\Support\Facades\Redis::ping();
        $services['redis'] = 'ok';
    } catch (\Throwable) {
        $services['redis'] = 'error';
        $overall = 'degraded';
    }

    // Queue (Horizon running = at least one master in the sorted set)
    // Use executeRaw to bypass Predis's key-prefix decoration.
    try {
        $horizonPrefix = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', config('app.name'))) . '_horizon';
        $count = \Illuminate\Support\Facades\Redis::connection()
            ->executeRaw(['ZCARD', "{$horizonPrefix}:masters"]);
        $services['queue'] = $count > 0 ? 'ok' : 'no_workers';
        if ($count === 0) {
            $overall = 'degraded';
        }
    } catch (\Throwable) {
        $services['queue'] = 'error';
        $overall = 'degraded';
    }

    // Storage (writable)
    try {
        \Illuminate\Support\Facades\Storage::disk('local')->put('.health', now()->toString());
        $services['storage'] = 'ok';
    } catch (\Throwable) {
        $services['storage'] = 'error';
        $overall = 'degraded';
    }

    $status = $overall === 'ok' ? 200 : 503;

    return response()->json(['status' => $overall, 'services' => $services], $status);
});
