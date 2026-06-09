#!/usr/bin/env bash
# GiftCraft Studio — production deploy script
# Usage: ./infra/scripts/deploy.sh [staging|production]

set -euo pipefail

ENV=${1:-production}
COMPOSE_FILE="infra/docker-compose.prod.yml"
APP_DIR="/var/www/giftcraft"
HEALTH_URL="https://giftcraft.vn/api/health"

if [[ "$ENV" == "staging" ]]; then
  HEALTH_URL="https://staging.giftcraft.vn/api/health"
fi

echo "=== [$(date)] Deploying to $ENV ==="

cd "$APP_DIR"

# Pull latest code
git pull origin "$(git rev-parse --abbrev-ref HEAD)"

# Build and start (only rebuild changed services)
docker compose -f "$COMPOSE_FILE" up -d --build --no-deps

# Run migrations (non-interactive)
docker compose -f "$COMPOSE_FILE" exec -T laravel php artisan migrate --force

# Clear caches
docker compose -f "$COMPOSE_FILE" exec -T laravel php artisan optimize:clear
docker compose -f "$COMPOSE_FILE" exec -T laravel php artisan queue:restart

# Smoke test
echo "=== Smoke test: $HEALTH_URL ==="
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$HEALTH_URL")

if [[ "$HTTP_STATUS" != "200" ]]; then
  echo "!!! Smoke test FAILED (HTTP $HTTP_STATUS). Rolling back..."
  git checkout HEAD~1
  docker compose -f "$COMPOSE_FILE" up -d --build --no-deps
  exit 1
fi

echo "=== Deploy SUCCESS (HTTP $HTTP_STATUS) ==="
