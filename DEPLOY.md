# GiftCraft Studio — Deployment Guide

## Prerequisites

Before starting, have these ready:
- Hetzner CX32 VPS (Ubuntu 24.04) — create at hetzner.com/cloud
- Domain `giftcraft.vn` pointed at the VPS IP (A record)
- GitHub repo with the code
- Accounts with API keys for: VNPay, MoMo, GHN, Resend, Cloudflare R2

---

## Step 1 — One-time server setup

SSH into the VPS as root, then run the setup script:

```bash
ssh root@<VPS_IP>
curl -o setup.sh https://raw.githubusercontent.com/your-org/giftcraft/main/infra/scripts/setup-server.sh
# Edit the script first: set REPO and DEPLOY_USER
nano setup.sh
bash setup.sh
```

What it does automatically:
- `apt upgrade`, installs Docker, git, certbot
- Issues a Let's Encrypt TLS cert for `giftcraft.vn` and `www.giftcraft.vn`
- Creates a `deploy` user, clones the repo to `/var/www/giftcraft`
- Opens ports 22/80/443 via UFW
- Registers the daily 2AM backup cron job

After it finishes, add your deploy SSH public key manually:

```bash
echo "ssh-ed25519 AAAA... your-key" >> /home/deploy/.ssh/authorized_keys
```

---

## Step 2 — Create the `.env` file on the server

```bash
su - deploy
cd /var/www/giftcraft
cp .env.example .env
nano .env
```

Fill in every value. The critical ones for production:

```dotenv
# App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://giftcraft.vn
APP_KEY=                        # generate: php artisan key:generate --show
FRONTEND_URL=https://giftcraft.vn

# Database — these become the Postgres container's credentials
DB_PASSWORD=<strong-random-password>

# Meilisearch — change from default, keep it secret
MEILISEARCH_KEY=<strong-random-key>

# Payments — use LIVE keys, not sandbox
VNPAY_TMN_CODE=<live-code>
VNPAY_HASH_SECRET=<live-secret>
VNPAY_URL=https://pay.vnpay.vn/vpcpay.html
VNPAY_RETURN_URL=https://giftcraft.vn/api/payment/vnpay/callback

MOMO_PARTNER_CODE=<live>
MOMO_ACCESS_KEY=<live>
MOMO_SECRET_KEY=<live>
MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=https://giftcraft.vn/api/payment/momo/callback

# Shipping
GHN_TOKEN=<live-token>
GHN_SHOP_ID=<live-shop-id>
GHN_ENDPOINT=https://online-gateway.ghn.vn/shiip/public-api

# Mail
RESEND_API_KEY=<live-key>

# Cloudflare R2 (image storage + backups)
R2_ACCESS_KEY_ID=<key>
R2_SECRET_ACCESS_KEY=<secret>
R2_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
R2_BUCKET=giftcraft

# Frontend (exposed to browser)
NEXT_PUBLIC_API_URL=https://giftcraft.vn/api
NEXT_PUBLIC_SITE_URL=https://giftcraft.vn
```

---

## Step 3 — First deploy

Still as the `deploy` user on the server:

```bash
cd /var/www/giftcraft
docker compose -f infra/docker-compose.prod.yml up -d --build
```

This builds and starts 7 containers: nginx, nextjs, laravel, horizon, postgres, redis, meilisearch.

Then run the one-time setup commands:

```bash
# Run all migrations
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan migrate --force

# Seed initial data (2 admins, 12 categories, 25 products, 8 portfolio items)
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan db:seed --force

# Index products into Meilisearch
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan scout:import "App\Models\Product"

# Clear and warm caches
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan optimize:clear
```

Verify the stack is healthy:

```bash
curl https://giftcraft.vn/api/health
# Expected: {"status":"ok","services":{"database":"ok","redis":"ok","queue":"ok","storage":"ok"}}
```

---

## Step 4 — GitHub Secrets (for CI/CD auto-deploy)

In the GitHub repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|---|---|
| `PROD_HOST` | VPS IP address |
| `PROD_USER` | `deploy` |
| `PROD_SSH_KEY` | Contents of the deploy user's **private** SSH key |
| `STAGING_HOST` | Staging VPS IP (if applicable) |
| `STAGING_USER` | `deploy` |
| `STAGING_SSH_KEY` | Staging SSH key |

Then in **Settings → Environments**, create a `production` environment and enable **Required reviewers** — this forces a manual approval before any push to `main` triggers a deploy.

---

## Step 5 — CI/CD flow (automatic from here)

Every push triggers:

```
push to main / staging
  └─ CI job (ci.yml)
       ├─ Backend: PHP 8.4, Postgres 16, runs php artisan test --parallel (22 tests)
       └─ Frontend: npm ci → lint → build
  └─ Deploy job (deploy.yml) — only runs if CI passes
       ├─ SSH into VPS
       ├─ git pull
       ├─ docker compose up -d --build
       ├─ php artisan migrate --force
       ├─ php artisan optimize:clear + queue:restart
       └─ Smoke test: curl /api/health → must return HTTP 200
            └─ If 200: deploy done
            └─ If not 200: git checkout HEAD~1 + rebuild (auto-rollback)
```

---

## Step 6 — Manual deploy (without GitHub Actions)

SSH as `deploy` and run:

```bash
cd /var/www/giftcraft
./infra/scripts/deploy.sh production
# or: ./infra/scripts/deploy.sh staging
```

---

## Step 7 — SSL certificate renewal

Certbot auto-renews. To force a renewal manually:

```bash
certbot renew --quiet
docker compose -f infra/docker-compose.prod.yml restart nginx
```

---

## Step 8 — Backups

The cron job installed in Step 1 runs `backup.sh` every day at 2AM:

- Dumps Postgres via `pg_dump` inside the container
- Gzips and uploads to Cloudflare R2 bucket `giftcraft-backups`
- Deletes R2 files older than 30 days

To run a manual backup immediately:

```bash
/var/www/giftcraft/infra/scripts/backup.sh
```

To restore from a backup:

```bash
# Download from R2
aws s3 cp s3://giftcraft-backups/giftcraft_20260610_020000.sql.gz /tmp/ \
  --endpoint-url $R2_ENDPOINT

gunzip /tmp/giftcraft_20260610_020000.sql.gz

docker compose -f infra/docker-compose.prod.yml exec -T postgres \
  psql -U giftcraft -d giftcraft_db < /tmp/giftcraft_20260610_020000.sql
```

---

## Step 9 — Admin credentials after first seed

| Account | Email | Password |
|---|---|---|
| Admin 1 | `admin@giftcraft.vn` | set in `AdminSeeder` |
| Admin 2 | `ops@giftcraft.vn` | set in `AdminSeeder` |

Change both passwords immediately after first deploy:

```bash
docker compose -f infra/docker-compose.prod.yml exec -T laravel \
  php artisan tinker --execute="App\Models\User::where('email','admin@giftcraft.vn')->first()->update(['password'=>bcrypt('NEW_SECURE_PASSWORD')]);"
```

---

## Port map (production)

| Host port | Service | Notes |
|---|---|---|
| 80 | Nginx | HTTP → redirects to 443 |
| 443 | Nginx | HTTPS entry point |
| — | laravel:8000 | Internal only (no host binding) |
| — | nextjs:3000 | Internal only |
| — | postgres:5432 | Internal only |
| — | redis:6379 | Internal only |
| — | meilisearch:7700 | Internal only |

No data ports are exposed to the internet in production (unlike local dev which binds 5433/6380/7701).

---

## Common operations

```bash
# View logs
docker compose -f infra/docker-compose.prod.yml logs -f laravel
docker compose -f infra/docker-compose.prod.yml logs -f nextjs

# Restart a single service
docker compose -f infra/docker-compose.prod.yml restart laravel

# Check queue workers (Horizon)
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan horizon:status

# Re-index search after bulk product changes
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan scout:import "App\Models\Product"

# Rollback last migration
docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan migrate:rollback

# Check container status
docker compose -f infra/docker-compose.prod.yml ps
```

---

## Infrastructure costs

| Service | Cost | Notes |
|---|---|---|
| VPS Hetzner CX32 | ~320,000đ/month | 4 vCPU, 8GB RAM |
| Domain .vn | ~25,000đ/month | |
| Cloudflare R2 | Free first 10GB | |
| SSL + Sentry + UptimeRobot + Resend | Free | |
| **Total** | **~350,000đ/month** | |
