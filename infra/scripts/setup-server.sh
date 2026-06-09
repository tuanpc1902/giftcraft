#!/usr/bin/env bash
# GiftCraft Studio — fresh VPS setup (Hetzner CX32, Ubuntu 24.04)
# Run as root once: bash setup-server.sh

set -euo pipefail

DOMAIN="giftcraft.vn"
REPO="git@github.com:your-org/hangstore.git"
APP_DIR="/var/www/giftcraft"
DEPLOY_USER="deploy"

echo "=== System update ==="
apt update && apt upgrade -y
apt install -y curl git unzip software-properties-common ufw

echo "=== Docker ==="
curl -fsSL https://get.docker.com | sh
usermod -aG docker "$DEPLOY_USER" 2>/dev/null || true

echo "=== Certbot ==="
apt install -y certbot
certbot certonly --standalone -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m admin@giftcraft.vn

echo "=== Deploy user ==="
id "$DEPLOY_USER" &>/dev/null || useradd -m -s /bin/bash "$DEPLOY_USER"
mkdir -p /home/$DEPLOY_USER/.ssh
# Paste your public key here:
# echo "ssh-ed25519 AAAA... deploy@giftcraft" >> /home/$DEPLOY_USER/.ssh/authorized_keys
chmod 700 /home/$DEPLOY_USER/.ssh
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh

echo "=== Clone repo ==="
mkdir -p "$APP_DIR"
chown $DEPLOY_USER:$DEPLOY_USER "$APP_DIR"
sudo -u $DEPLOY_USER git clone "$REPO" "$APP_DIR"

echo "=== Firewall ==="
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "=== Crontab — daily backup 2AM ==="
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/infra/scripts/backup.sh >> /var/log/giftcraft-backup.log 2>&1") | crontab -

echo "=== Done. Next: cp .env.example .env, fill secrets, ./infra/scripts/deploy.sh ==="
