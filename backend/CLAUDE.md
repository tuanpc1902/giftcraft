# GiftCraft Backend — Developer Context

## Stack

- **Laravel 13** on **PHP 8.4**
- **PostgreSQL 16** (host port 5433 locally)
- **Redis 7** — cache, sessions, Horizon queues (host port 6380)
- **Meilisearch** — full-text search (host port 7701, Phase 2)
- Auth: **Laravel Sanctum** (personal access tokens, stored client-side)
- Container: runs as `laravel` service in Docker Compose project `giftcraft`

---

## Project layout

```
backend/
├── app/
│   ├── Http/
│   │   ├── Concerns/ApiResponse.php       — success()/error() response helpers
│   │   ├── Controllers/Api/               — one controller per feature
│   │   │   ├── Admin/ProductController.php
│   │   │   ├── AuthController.php
│   │   │   ├── B2bQuoteController.php
│   │   │   ├── CartController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── OrderController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── PortfolioController.php
│   │   │   ├── ProductController.php
│   │   │   └── ShippingController.php
│   │   ├── Requests/                      — Form Requests with validation rules
│   │   ├── Resources/                     — API Resources (JSON transformers)
│   │   └── Middleware/EnsureRole.php       — role:admin check
│   ├── Models/                            — Eloquent models
│   ├── Services/
│   │   ├── B2bPricingService.php
│   │   ├── ShippingService.php            — GHN API + fallback
│   │   └── OrderNumberService.php
│   └── Jobs/                              — queued jobs (emails etc.)
├── database/
│   ├── migrations/                        — 11 migrations
│   └── seeders/                           — 2 admins, 12 categories, 25 products, 8 portfolio
└── routes/
    └── api.php                            — all API routes
```

---

## All API endpoints

### Public
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/products                 ?category=&price_min=&price_max=&sort=&per_page=
GET    /api/products/{slug}
GET    /api/categories
GET    /api/portfolio                ?per_page=
GET    /api/portfolio/{id}
GET    /api/search                   ?q=&per_page=&page=  (Meilisearch full-text)
POST   /api/supplier/apply
POST   /api/jobs/apply
POST   /api/cart/items               X-Session-ID header for guest
GET    /api/cart
PUT    /api/cart/items/{productId}
DELETE /api/cart/items/{productId}
DELETE /api/cart
POST   /api/cart/apply-voucher
POST   /api/cart/remove-voucher
POST   /api/shipping/calculate
POST   /api/b2b/quotes               (public — no auth required)
POST   /api/orders/checkout
GET    /api/orders/{orderNumber}
GET    /api/payment/vnpay/callback
POST   /api/payment/vnpay/ipn
GET    /api/payment/momo/callback
POST   /api/payment/momo/ipn
GET    /api/health
```

### Auth-required (Bearer token)
```
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
GET    /api/b2b/quotes               own quotes (user)
GET    /api/b2b/quotes/{id}
GET    /api/orders                   own orders
```

### Admin-only (role:admin)
```
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
GET    /api/admin/orders             ?delivery_type=
PUT    /api/admin/orders/{id}/status
GET    /api/admin/b2b/quotes
PUT    /api/admin/b2b/quotes/{id}
GET    /api/admin/supplier-applications
PUT    /api/admin/supplier-applications/{id}
GET    /api/admin/job-applications
PUT    /api/admin/job-applications/{id}
GET    /api/admin/stats
```

### Phase 2 complete — all endpoints implemented

---

## Standard response shape (`ApiResponse` trait)

```php
// Success
return $this->success($data, 'Optional message', 201);
// → { "success": true, "data": ..., "message": "..." }

// Error
return $this->error('Validation failed', 422, $errors);
// → { "success": false, "message": "...", "errors": {...} }
```

---

## Controller skeleton

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $items = MyModel::query()
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return $this->success([
            'items' => MyResource::collection($items->items()),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'total' => $items->total(),
            ],
        ]);
    }
}
```

---

## Route registration pattern

```php
// In routes/api.php — public:
Route::get('/my-resource', [MyController::class, 'index']);

// Auth-gated:
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-resource', [MyController::class, 'index']);
});

// Admin-only:
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('my-resource', Admin\MyController::class);
});
```

---

## Model conventions

```php
// Models live in App\Models\
// Activity logging: use Models\Concerns\LogsActivity trait
// LogOptions from: Spatie\Activitylog\LogOptions (not Models\LogOptions)
use Spatie\Activitylog\LogOptions;
use App\Models\Concerns\LogsActivity;

// B2B quote statuses:
// new | reviewing | quoted | approved | in_production | delivered | cancelled
```

---

## PHP 8.4 gotchas

1. **Queue job `$queue` property** — Don't declare `protected string $queue = 'emails'`.  
   Use `$this->onQueue('emails')` in the constructor instead.

2. **Predis key prefix** — Don't use `Redis::zcard('key')` with a prefixed key.  
   Use `Redis::connection()->executeRaw(['ZCARD', 'full:key'])` to bypass prefix decoration.

3. **`spatie/laravel-activitylog` v5**:
   - Trait: `App\Models\Concerns\LogsActivity`
   - LogOptions: `Spatie\Activitylog\LogOptions` (not `Spatie\Activitylog\Models\LogOptions`)

4. **Typed properties** — PHP 8.4 is strict about uninitialized typed properties.  
   Always initialise or mark as nullable (`?string`).

---

## Auth token response shape

```json
{
  "success": true,
  "data": {
    "token": "1|abc...",
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "customer"
    }
  },
  "message": "Đăng nhập thành công"
}
```
Frontend reads `data.data.token` and `data.data.user`.

---

## Running tests

```powershell
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test
# ~62 tests: Auth×5, Cart×5, Checkout×4, Product×6, Example×2, Review×13, Blog×11, Loyalty×6, SupplierJob×10

# Run single suite
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test --filter ReviewTest

# Run in parallel (faster)
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test --parallel
```

---

## Seeded credentials

```
Admin 1:  admin@giftcraft.vn   / password (check seeder)
Admin 2:  ops@giftcraft.vn     / password
```
