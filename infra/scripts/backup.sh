#!/usr/bin/env bash
# GiftCraft Studio — PostgreSQL backup to Cloudflare R2
# Crontab: 0 2 * * * /var/www/giftcraft/infra/scripts/backup.sh >> /var/log/giftcraft-backup.log 2>&1

set -euo pipefail

APP_DIR="/var/www/giftcraft"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/giftcraft_${TIMESTAMP}.sql.gz"
R2_BUCKET="giftcraft-backups"
KEEP_DAYS=30

echo "=== [$(date)] Starting backup ==="

# Load env
set -a
source "$APP_DIR/.env"
set +a

# Dump from postgres container
docker compose -f "$APP_DIR/infra/docker-compose.prod.yml" exec -T postgres \
  pg_dump -U "$DB_USERNAME" "$DB_DATABASE" | gzip > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"

# Upload to R2 via aws-cli (compatible with R2)
AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
aws s3 cp "$BACKUP_FILE" "s3://${R2_BUCKET}/$(basename "$BACKUP_FILE")" \
  --endpoint-url "$R2_ENDPOINT"

rm -f "$BACKUP_FILE"
echo "Uploaded to R2: $(basename "$BACKUP_FILE")"

# Delete backups older than KEEP_DAYS
AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
aws s3 ls "s3://${R2_BUCKET}/" --endpoint-url "$R2_ENDPOINT" \
  | awk '{print $4}' \
  | while read -r key; do
      file_date=$(echo "$key" | grep -oE '[0-9]{8}' | head -1)
      if [[ -n "$file_date" ]]; then
        age=$(( ( $(date +%s) - $(date -d "$file_date" +%s 2>/dev/null || date -j -f "%Y%m%d" "$file_date" +%s) ) / 86400 ))
        if [[ "$age" -gt "$KEEP_DAYS" ]]; then
          AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
          AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
          aws s3 rm "s3://${R2_BUCKET}/$key" --endpoint-url "$R2_ENDPOINT"
          echo "Deleted old backup: $key (${age}d old)"
        fi
      fi
    done

echo "=== Backup complete ==="
