# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project overview

GiftCraft Studio — premium customised-gift e-commerce for the Vietnamese market (B2C + B2B).  
Monorepo: `frontend/` (Next.js) + `backend/` (Laravel) + `infra/` (Docker / Nginx).  
Production: `giftcraft.vn` on Hetzner CX32 (~350 k VNĐ/month).

---

## Development commands

### Start the full stack (Docker)
```powershell
docker compose -f infra/docker-compose.yml -p giftcraft up -d
```
Port map: **80** → Nginx (reverse proxy), **5433** → Postgres, **6380** → Redis, **7701** → Meilisearch.  
Nginx routes `/api/*` to the Laravel container and everything else to Next.js.

### Laravel (backend)
```powershell
# All artisan commands run through Docker:
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan <cmd>

# Run ALL tests (22 tests, ~22s)
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test

# Run a single test class
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test --filter AuthTest

# Run a single test method
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test --filter test_user_can_login

# Run in parallel (faster)
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test --parallel

# Migrate
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan migrate --force

# Re-seed (2 admins, 12 categories, 25 products, 8 portfolio items)
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan db:seed --force

# Clear all caches
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan cache:clear

# Check routes
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan route:list
```

> **Windows bind-mount gotcha**: Docker Desktop on Windows sometimes does not propagate new files from the host into a running container. If a new migration or PHP file is not visible inside the container, use:
> ```powershell
> docker cp backend\path\to\file.php giftcraft-laravel-1:/var/www/html/path/to/file.php
> ```
> Then run `php artisan route:clear` or `php artisan migrate` as needed.

### Next.js (frontend)
```powershell
cd frontend
npm run dev     # http://localhost:3000 (bypasses Nginx — no /api proxy)
npm run build   # production build (used by CI)
npm run lint    # ESLint
```
For full-stack dev with API calls working, use the Docker stack (port 80) rather than `npm run dev`.

### CI (GitHub Actions)
Triggered on push/PR to `main` or `staging`.  
- **Backend job**: spins up Postgres 16 + Redis 7, copies `backend/.env.ci`, runs `php artisan test --parallel`.
- **Frontend job**: `npm ci` → `npm run lint` → `npm run build`.

---

## Architecture

### Request path
```
Browser → Nginx :80
  /api/* → Laravel :8000  (FPM in Docker)
  /*     → Next.js :3000  (Node in Docker)
```

### Backend (Laravel 13 / PHP 8.4)

**Service layer** — business logic lives in `app/Services/`, not in controllers:

| Service | Responsibility |
|---|---|
| `CartService` | Redis-backed cart. Keys: `cart:user:{id}` or `cart:guest:{sessionId}`. TTL 7 days. Merge on login. |
| `OrderService` | Atomic `DB::transaction` checkout with `lockForUpdate()` on products + voucher. Idempotency via Redis key `idempotency:{key}` (24h). Dispatches `SendOrderConfirmationEmail` job. |
| `OrderNumberService` | Generates `GC-YYYYMMDD-NNNNN` using an atomic Redis `INCR` per-day counter. |
| `B2bPricingService` | 5-tier B2B pricing (`qty ≥ 20/50/100/200/300`). Reads `products.b2b_price_tiers` JSON. |
| `ShippingService` | Calls GHN API; falls back to weight-tier table (30/45/65/99k) × 1.5 for inter-province. Express = standard + 30k surcharge. |
| `Payment\VNPayService` | Builds HMAC-SHA512-signed redirect URL. Amount × 100 for VNPay. |
| `Payment\MoMoService` | MoMo ATM/QR payment URL. |

**Controllers** are thin — they validate input, call a service, and return `$this->success(...)` or `$this->error(...)` from `ApiResponse` trait.

**Auth**: Laravel Sanctum personal access tokens (7-day TTL). Token is returned in login/register response as `data.token`; the frontend stores it in `localStorage("token")`. Role check is via custom `EnsureRole` middleware (`role:admin`), which reads `users.role` (string column, not Spatie Permission roles). `User.phone` is encrypted at rest.

**Response envelope** (always):
```json
{ "success": true|false, "data": ..., "message": "...", "errors": {} }
```

**Checkout flow** (critical path):
1. Client sends `POST /api/orders/checkout` with `Idempotency-Key` header.
2. `OrderService::checkout()` opens a DB transaction, calls `lockForUpdate()` on all cart products, validates stock, calculates shipping, creates `Order` + `OrderItem` rows, increments voucher `used_count`, clears the cart.
3. On success, caches the response for 24h (idempotency), dispatches email job, returns order number + optional payment URL.
4. For VNPay/MoMo, the frontend redirects to `payment_url`; callbacks land on `/api/payment/{gateway}/callback`.

**Product optimistic locking**: `PUT /api/admin/products/{id}` requires a `version` field matching the DB value; returns 409 on mismatch.

**Caching**: Product list/detail are cached in Redis via `Cache::remember()` in `ProductController`. Admin product writes call `Cache::flush()` to invalidate.

**Queue**: Horizon with two supervisors — `default` (×3 workers) and `emails` (×2 workers). Jobs use `$this->onQueue('emails')` in the constructor, not a `$queue` property (PHP 8.4 restriction).

**Activity log**: Spatie v5. Correct imports:
```php
use Spatie\Activitylog\Traits\LogsActivity;   // trait
use Spatie\Activitylog\LogOptions;             // options class
```
The `Support\LogOptions` or `Models\Concerns\LogsActivity` paths are wrong for v5.

**Migrations**: 19 tables. B2B status column was converted from a PostgreSQL enum to `VARCHAR(50)` with a check constraint so values can be added without a complex DDL migration.

### Frontend (Next.js 16 / React 19 / Tailwind v4)

**Rendering split**:
- Server Components (ISR/SSR): homepage, product listing, product detail (`revalidate: 3600`), forfolio. Use `fetch()` directly.
- Client Components: cart, checkout, admin pages, account pages, blog. Use `api` from `@/lib/api` (Axios).

**State**:
- `useCartStore` (Zustand) — syncs with backend on every mutation; the cart badge in Header reads `cart.total_items`.
- `useAuthStore` (Zustand) — reads from `localStorage("token")` + `localStorage("gc_user")` via `init()`. Must call `init()` in a `useEffect` on every page that checks auth. Does not persist automatically.

**API client** (`src/lib/api.ts`): Axios instance. Interceptor attaches `Authorization: Bearer <token>` and `X-Session-ID: <uuid>` to every request. The session UUID is created on first load and stored in `localStorage("session_id")`.

**Guest cart flow**: The `X-Session-ID` header identifies guest carts. On login, `CartService::merge()` merges the guest key into the user key, keeping the higher quantity on conflict.

**Auth guard pattern** (any protected page):
```tsx
const { user, init } = useAuthStore();
useEffect(() => { init(); }, [init]);
useEffect(() => {
  if (user === null) {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/dang-nhap");
  }
}, [user, router]);
if (!user) return <div className="...">Đang tải...</div>;
```

**Tailwind v4 key differences** (breaks from v3):
- No `tailwind.config.ts` — custom tokens go in `globals.css` under `@theme`.
- `bg-gradient-to-br` → `bg-linear-to-br`.
- `h-4.5`, `w-4.5` do not exist — use `h-[18px]` etc.
- Interactive handlers (`onClick`, `onSubmit`) require `"use client"`.

**Admin pages** all follow a consistent pattern: client component, `api.get("/admin/...")`, data table with `divide-y divide-gray-50`, right-side drawer for detail/edit (fixed overlay, click-outside closes), modal for add/edit forms.

**Image rules**: Always use `<Image>` from `next/image`, never bare `<img>`. Remote hosts allowed: `*.r2.cloudflarestorage.com` and `placehold.co` (see `next.config.ts`).

---

## Data model (key tables)

| Table | Notes |
|---|---|
| `users` | `role` column: `customer` or `admin`. `phone` is encrypted. Has `loyalty_points`, `loyalty_tier`, `birthday` for Phase 3. |
| `products` | `b2b_price_tiers` is a JSON array `[{qty, price}, ...]`. `images` is a JSON array of URLs. `version` int for optimistic locking. Soft-deleted. |
| `orders` | `shipping_address` is a JSON object. `delivery_type`: `standard` or `express`. `idempotency_key` prevents duplicate orders. Soft-deleted. |
| `order_items` | `product_snapshot` JSON captures name/slug/image/sku at order time. |
| `b2b_quotes` | `status`: `new \| reviewing \| quoted \| approved \| in_production \| delivered \| cancelled` (VARCHAR with check constraint). `admin_note` is customer-visible; `sales_notes` is internal. |
| `vouchers` | `type`: `percent` or `fixed`. `max_discount` caps percent vouchers. |
| `portfolio_projects` | `gallery_images` JSON array. `is_featured` toggleable from admin. `sort_order` int. Soft-deleted. |

---

## Environment setup

Copy `.env.example` to `.env` at the repo root and fill in the empty values. The Docker stack reads from root `.env` for all services.

Required for payments:
- `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` — use sandbox values for local dev
- `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`

Required for shipping:
- `GHN_TOKEN`, `GHN_SHOP_ID` — ShippingService falls back to weight-tier table if missing

Required for email:
- `RESEND_API_KEY` — jobs will fail silently if missing in local dev

---

## Phase status (as of 2026-06-10)

| Phase | Status | Notes |
|---|---|---|
| 0 — Setup | ✅ | Docker, 19 migrations, seeders |
| 1 — MVP API + UI | ✅ | Auth, Products, Cart, Checkout, VNPay/MoMo, Admin base |
| 2 — B2B + Portfolio | ✅ | All frontend pages + B2B/Portfolio backend CRUD |
| 3 — Loyalty + Reviews + Blog CMS | ⏳ | Schema exists (`loyalty_points`, `reviews` table) |
| 4 — AI Chatbot + PWA + Scale | ⏳ | — |

**Remaining Phase 2 backend**: `GET /api/search?q=` (Meilisearch), supplier/job application endpoints.

---

## Custom slash commands (`.claude/commands/`)

| Command | Use when |
|---|---|
| `/new-page` | Adding a new frontend route — includes server vs client templates + checklist |
| `/new-api` | Adding a new Laravel endpoint — controller skeleton, route registration, gotchas |
| `/new-admin` | Adding an admin panel page — table + drawer + modal boilerplate |
| `/phase` | Print current phase progress from `PROGRESS.md` |
| `/fix-ui` | Run the full UI bug checklist across changed files |
