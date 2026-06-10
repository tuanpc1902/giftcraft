# GiftCraft Studio — Project Context

## What this is
E-commerce platform for premium customised gifts (B2C + B2B), targeting the Vietnamese market.  
Live domain: **giftcraft.vn** · Stack built for ~350k VNĐ/month on Hetzner CX32.

---

## Tech stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 16.2 |
| UI runtime | React | 19.2 |
| Styling | Tailwind CSS | v4 (PostCSS, no config file) |
| State | Zustand | 5 |
| Data fetching | TanStack Query + Axios | 5 / 1.17 |
| Backend | Laravel | 13 |
| Runtime | PHP | 8.4 |
| Database | PostgreSQL | 16 |
| Cache / Queue | Redis | 7 |
| Search | Meilisearch | latest |
| Containers | Docker Compose | giftcraft project name |
| CI/CD | GitHub Actions | ci.yml + deploy.yml |

---

## Monorepo layout

```
giftcraft/
├── frontend/          Next.js app (src/app App Router)
├── backend/           Laravel API (prefix: /api)
├── infra/
│   ├── docker-compose.yml        local dev
│   ├── docker-compose.prod.yml   production
│   └── nginx/
│       ├── local.conf
│       └── production.conf
├── PROGRESS.md        ← authoritative phase tracker
└── CLAUDE.md          ← this file
```

---

## Phase status (as of 2026-06-10)

| Phase | Name | Status |
|---|---|---|
| 0 | Setup, Docker, DB, Seeders | ✅ Done |
| 1 | Core API + Frontend MVP | ✅ Done |
| 2 | B2B + Forfolio (Frontend) | ✅ Done |
| 2 | B2B + Forfolio (Backend remaining) | 🔄 In progress |
| 3 | Loyalty, Reviews, Blog CMS | ⏳ TODO |
| 4 | AI Chatbot, PWA, Scale | ⏳ TODO |

**Phase 2 backend still needed:**
- `GET /b2b/quotes/my` — user's own quotes (auth required)
- `GET /admin/portfolio` with pagination, `POST/PUT/DELETE /admin/portfolio`
- `GET /admin/stats` real data (currently returns zeros for B2B count)
- Meilisearch full-text search endpoint
- Supplier/job application portal

---

## All frontend routes

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` → `_home/HomePage.tsx` | SSR, ISR 900s |
| `/san-pham` | `app/(shop)/san-pham/page.tsx` | filter, pagination |
| `/san-pham/[slug]` | `app/(shop)/san-pham/[slug]/page.tsx` | ISR 3600s, JSON-LD |
| `/gio-hang` | `app/(shop)/gio-hang/page.tsx` | client, Zustand cart |
| `/checkout` | `app/(shop)/checkout/page.tsx` | 4-step, VNPay/MoMo |
| `/don-hang/[orderNumber]` | `app/(shop)/don-hang/[orderNumber]/page.tsx` | payment polling |
| `/dang-nhap` | `app/dang-nhap/page.tsx` | auth, calls `init()` |
| `/dang-ky` | `app/dang-ky/page.tsx` | register, calls `init()` |
| `/tai-khoan` | `app/tai-khoan/page.tsx` | protected, 3 tabs |
| `/tai-khoan/du-an` | `app/tai-khoan/du-an/page.tsx` | B2B portal, protected |
| `/qua-tang-doanh-nghiep` | `app/qua-tang-doanh-nghiep/page.tsx` | B2B landing |
| `/bat-dau-du-an-moi` | `app/bat-dau-du-an-moi/page.tsx` | 5-step B2B form |
| `/forfolio` | `app/forfolio/page.tsx` | SSR + client lightbox |
| `/gift-finder` | `app/gift-finder/page.tsx` | 4-question quiz |
| `/blog` | `app/blog/page.tsx` | client, category filter |
| `/admin` | `app/admin/page.tsx` | dashboard, stats |
| `/admin/don-hang` | `app/admin/don-hang/page.tsx` | orders + drawer |
| `/admin/san-pham` | `app/admin/san-pham/page.tsx` | product CRUD |
| `/admin/b2b` | `app/admin/b2b/page.tsx` | B2B quotes management |
| `/admin/forfolio` | `app/admin/forfolio/page.tsx` | portfolio CRUD |

---

## All backend API endpoints

See `backend/routes/api.php` for the full list.  
Base path: `/api` (proxied by Nginx from port 80).

**Auth** — `/api/auth/{register,login,logout,me,refresh,forgot-password,reset-password}`  
**Products** — `GET /api/products`, `GET /api/products/{slug}`  
**Categories** — `GET /api/categories`  
**Portfolio** — `GET /api/portfolio`, `GET /api/portfolio/{id}`  
**Cart** — `GET/POST/PUT/DELETE /api/cart` + voucher endpoints (X-Session-ID or Bearer)  
**Shipping** — `POST /api/shipping/calculate`  
**B2B Quotes** — `POST /api/b2b/quotes` (public), `GET /api/b2b/quotes` (authed)  
**Orders** — `POST /api/orders/checkout`, `GET /api/orders/{orderNumber}`, `GET /api/orders` (authed)  
**Payments** — VNPay + MoMo callback + IPN routes  
**Admin** — `/api/admin/*` (role:admin middleware)

---

## Docker commands

```powershell
# Start stack
docker compose -f infra/docker-compose.yml -p giftcraft up -d

# Laravel Artisan
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan <cmd>

# Run tests
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan test

# Re-seed
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan db:seed --force

# Clear all cache
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel php artisan cache:clear

# Frontend dev
cd frontend && npm run dev     # http://localhost:3000

# Check stack health
docker compose -f infra/docker-compose.yml -p giftcraft ps
curl http://localhost/api/health
```

**Host port map:** Postgres → 5433, Redis → 6380, Meilisearch → 7701

---

## Key conventions

- All UI text in Vietnamese. Currency via `formatPrice()` (`vi-VN` locale, VNĐ).
- Vietnamese slugs: `/san-pham`, `/gio-hang`, `/dang-nhap`, etc.
- API response envelope: `{ success, data, message }` via `ApiResponse` trait.
- Auth: Laravel Sanctum tokens stored in `localStorage("token")` + `gc_user`.
- Guest cart: UUID in `localStorage("session_id")` sent as `X-Session-ID` header.
- Admin routes require `role:admin` middleware on backend.
- Tailwind v4 — no `tailwind.config.ts`; theme via `@theme` in `globals.css`.

---

## Seeded test data

- Admin accounts: 2 admins (check `backend/database/seeders/`)
- Products: 25 seeded
- Categories: 12 seeded
- Portfolio: 8 seeded

---

## Custom slash commands

| Command | Purpose |
|---|---|
| `/new-page` | Scaffold a new frontend page |
| `/new-api` | Add a new Laravel API endpoint |
| `/new-admin` | Add an admin panel page |
| `/phase` | Print current phase status |
| `/fix-ui` | Systematic UI bug analysis checklist |
