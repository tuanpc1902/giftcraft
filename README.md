# GiftCraft Studio

Website quà tặng (B2C + B2B), cải tiến từ mô hình hangstore.net.

**Stack:** Next.js 14 (App Router) · Laravel 11 · PostgreSQL 16 · Redis 7 · Meilisearch · Docker

## Cấu trúc monorepo

```
.
├── frontend/          # Next.js 14 + TypeScript + Tailwind
├── backend/           # Laravel 11 API
├── infra/
│   ├── nginx/         # local.conf, production.conf
│   ├── scripts/       # setup-server.sh, deploy.sh, backup.sh
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
└── .github/workflows/ # ci.yml, deploy.yml
```

## Nghiệp vụ đặc thù

- **Bảng giá B2B 5 tier** lưu JSON trong `products.b2b_price_tiers`.
- `delivery_type` (standard/express) + `requested_delivery_date` là field riêng.
- `gift_message` tách khỏi `customer_note`.
- Tính phí ship live qua GHN API trước checkout.
- B2B portal tự động + theo dõi real-time qua WebSocket.

## Setup local

> Yêu cầu: Docker + Docker Compose. Không cần cài PHP/Composer/Node trên host.

```bash
# 1. Tạo .env từ mẫu
cp .env.example .env

# 2. Khởi động toàn bộ stack
docker compose -f infra/docker-compose.yml up -d

# 3. Generate app key + migrate (lần đầu)
docker compose -f infra/docker-compose.yml exec laravel php artisan key:generate
docker compose -f infra/docker-compose.yml exec laravel php artisan migrate --seed
```

| Service       | URL                       |
|---------------|---------------------------|
| Frontend      | http://localhost          |
| API           | http://localhost/api      |
| Horizon       | http://localhost/horizon  |
| Meilisearch   | http://localhost:7700     |

## Lệnh thường dùng

```bash
# Logs
docker compose -f infra/docker-compose.yml logs -f laravel

# Artisan
docker compose -f infra/docker-compose.yml exec laravel php artisan <cmd>

# Composer (nếu chưa có trên host)
docker run --rm -v "$PWD/backend:/app" -w /app composer:2 <cmd>
```

## Roadmap

5 phases / 20 tuần — xem `giftcraft-implementation-guide.md`.

| Phase | Nội dung                       | Tuần   |
|-------|--------------------------------|--------|
| 0     | Setup & Infra                  | 1–2    |
| 1     | MVP Core (đơn hàng, B2B tiers) | 3–8    |
| 2     | B2B Portal + Forfolio          | 9–12   |
| 3     | Loyalty + SEO                  | 13–16  |
| 4     | Scale + AI                     | 17–20  |
