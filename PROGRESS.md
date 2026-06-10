# GiftCraft Studio — Tiến độ triển khai
> Cập nhật tự động. Stack thực tế: Next.js 14 + Laravel **13** (PHP 8.4) + PostgreSQL 16 + Redis 7 + Meilisearch + Docker

---

## Tổng quan phase

| Phase | Tên | Tuần | Trạng thái | Commit |
|-------|-----|------|-----------|--------|
| **Phase 0** | Chuẩn bị & Setup | 1–2 | ✅ DONE | `c88a492` |
| **Phase 1** | MVP Core (Backend) | 3–6 | ✅ DONE | `f2e4826` |
| **Phase 1** | MVP Core (Frontend) | 6–8 | ✅ DONE | `d802840` |
| **Phase 2** | B2B + Forfolio | 9–12 | ✅ DONE | — |
| **Phase 3** | Loyalty + SEO | 13–16 | 🔄 IN PROGRESS | — |
| **Phase 4** | Scale + AI | 17–20 | ⏳ TODO | — |

---

## ✅ Phase 0 — Chuẩn bị & Setup (commit `c88a492`)

| Bước | Nội dung | Ghi chú |
|------|----------|---------|
| 01 | Monorepo scaffold | frontend/ + backend/ + infra/ ở root |
| 02 | Docker Compose local | 7 services: nginx, nextjs, laravel, horizon, postgres, redis, meilisearch |
| 03 | NGINX config | local.conf + production.conf (rate limit, security headers) |
| 04 | 11 migrations + 11 models | users, categories, products, orders, order_items, b2b_quotes, portfolio, vouchers, reviews, supplier_applications, job_applications |
| 05 | B2bPricingService + ShippingService + OrderNumberService | GHN API + fallback |
| 06 | Seeders | 2 admins, 12 categories, 25 products, 8 portfolio |
| 07 | GitHub Actions CI/CD | ci.yml + deploy.yml |

**Ghi chú kỹ thuật:**
- Laravel 13 (PHP 8.4) thay vì Laravel 11 (PHP 8.3) như guide
- `spatie/laravel-activitylog` v5: trait ở `Models\Concerns\LogsActivity`, LogOptions ở `Support\LogOptions`
- Compose project name: `giftcraft`; host ports: 5433/6380/7701 (tránh xung đột)
- `backend/.env` riêng (gitignored), không dùng root `.env`

---

## ✅ Phase 1 Backend — MVP Core API (commit `f2e4826`)

| Bước | Nội dung | Verify |
|------|----------|--------|
| 01 | Auth API | register, login (rate-limit 5/min), logout, me, refresh, forgot/reset-password |
| 02 | Product API + B2B tiers | list (filter/cache 5min), detail (5 tiers, related, reviews_summary, cache 10min), admin CRUD |
| 03 | Cart API (Redis TTL 7d) | add/update/remove, voucher, guest via X-Session-ID, merge on login |
| 04 | Checkout + VNPay + MoMo + Email Queue | atomic transaction, idempotency-key, lockForUpdate |
| 04+ | Horizon | 2 supervisors (default×3, emails×2) |
| 08 | Health check /api/health | DB + Redis + Horizon (executeRaw) + Storage |
| 08 | Production compose + scripts | docker-compose.prod.yml, deploy.sh, backup.sh |

**Tests: 22/22 pass** (Auth×5, Cart×5, Checkout×4, Product×6, Example×2)

**PHP 8.4 gotchas:**
- `$queue` property trên Job → dùng `$this->onQueue('emails')` trong constructor
- Predis prefix → dùng `Redis::connection()->executeRaw(['ZCARD', 'key'])`

---

## ✅ Phase 1 Frontend — MVP UI (commit `d802840`)

| Bước | Nội dung | Trang |
|------|----------|-------|
| 05 | Trang sản phẩm | `/san-pham/[slug]` — ISR 3600s, gallery, B2B 5-tier table, cart, JSON-LD |
| 06 | Checkout Flow | `/checkout` — 4 bước, gift_message + customer_note tách, live shipping |
| 06+ | Order page | `/don-hang/[orderNumber]` — polling payment 3s×10, timeline |
| 07 | Admin panel | `/admin` dashboard, `/admin/don-hang` (delivery_type badge, detail drawer), `/admin/san-pham` |

**Shared code:** axios API client, Zustand cart store, TanStack Query, ProductCard, B2bQuoteModal, Header

---

## 🔄 Phase 2 — B2B + Forfolio (IN PROGRESS)

### User-facing UI:

| Trang | Mô tả | Trạng thái |
|-------|-------|-----------|
| `/` | Trang chủ | ✅ DONE |
| `/san-pham` | Danh sách sản phẩm + filter | ✅ DONE |
| `/gio-hang` | Giỏ hàng | ✅ DONE |
| `/qua-tang-doanh-nghiep` | B2B Landing | ✅ DONE |
| `/bat-dau-du-an-moi` | B2B Quote form 5 bước | ✅ DONE |
| `/forfolio` | Portfolio với filter + lightbox | ✅ DONE |
| `/gift-finder` | Gift finder 4 bước | ✅ DONE |
| `/dang-nhap` | Trang đăng nhập | ✅ DONE |
| `/dang-ky` | Trang đăng ký | ✅ DONE |
| `/tai-khoan` | Account hub (profile + orders) | ✅ DONE |
| `/tai-khoan/du-an` | B2B portal tracking | ✅ DONE |
| `/blog` | Blog listing + newsletter | ✅ DONE |
| Header | Mobile menu + auth dropdown | ✅ DONE |

### Admin UI:

| Trang | Mô tả | Trạng thái |
|-------|-------|-----------|
| `/admin` | Dashboard + stats | ✅ DONE |
| `/admin/don-hang` | Order management + drawer | ✅ DONE |
| `/admin/san-pham` | Products CRUD (add/edit/delete + search) | ✅ DONE |
| `/admin/b2b` | B2B quotes + status + price + note | ✅ DONE |
| `/admin/forfolio` | Portfolio CRUD + featured toggle | ✅ DONE |

### Backend Phase 2:

| Bước | Nội dung | Trạng thái |
|------|----------|-----------|
| 01 | B2B Quote API — `GET /b2b/quotes/my`, status enum fix, `admin_note` field | ✅ DONE |
| 02 | `PUT /auth/profile` — update name/phone | ✅ DONE |
| 03 | Admin Portfolio CRUD — `GET/POST/PUT/DELETE /admin/portfolio` | ✅ DONE |
| 04 | Admin stats — real B2B count, fix `new_b2b_quotes` | ✅ DONE |
| 05 | Meilisearch + Search API — `GET /api/search?q=` | ✅ DONE |
| 06 | Supplier Portal + Tuyển dụng — `POST /api/supplier/apply`, `POST /api/jobs/apply` + admin CRUD | ✅ DONE |

---

## 🔄 Phase 3 — Loyalty + SEO

| Bước | Nội dung | Trạng thái |
|------|----------|-----------|
| 01 | Loyalty Engine (tier: Silver/Gold/Diamond, points) | ✅ DONE |
| 02 | Voucher System + Birthday Reward | ✅ DONE |
| 03 | Review System | ✅ DONE |
| 04 | Blog CMS (admin CRUD + public API + detail page) | ✅ DONE |
| 05 | Email Automation (review request +3d, birthday voucher) | ✅ DONE |
| 06 | SEO Structured Data (JSON-LD on blog/product) | ⏳ TODO |
| 07 | Abandoned cart email (scheduled job) | ⏳ TODO |

---

## ⏳ Phase 4 — Scale + AI

| Bước | Nội dung |
|------|----------|
| 01 | ISR + Redis Cache Tags + Image Optimization |
| 02 | AI Chatbot tư vấn quà (Claude API, streaming) |
| 03 | PWA + Zalo OA + Web Push |
| 04 | PITR Backup + Security Audit |

---

## Chi phí hạ tầng

| Dịch vụ | Chi phí | Ghi chú |
|---------|---------|---------|
| VPS Hetzner CX32 | ~320.000đ/tháng | 4 vCPU, 8GB RAM |
| Domain .vn | ~25.000đ/tháng | |
| Cloudflare R2 | Free 10GB đầu | |
| SSL + Sentry + UptimeRobot + Resend | Miễn phí | |
| **Tổng** | **~350.000đ/tháng** | |

---

## Lệnh hữu ích

```bash
# Artisan (dùng PowerShell)
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan <cmd>

# Tests
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test

# Seed lại
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan db:seed --force

# Clear cache sau khi seed
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan cache:clear

# Next.js dev
cd frontend && npm run dev

# Kiểm tra stack
docker compose -f infra/docker-compose.yml -p giftcraft ps
```

---

*Cập nhật: 2026-06-10 | Phase 1 hoàn tất | Phase 2 Frontend + Backend (core) hoàn tất | Còn lại: Meilisearch Search + Supplier Portal*
