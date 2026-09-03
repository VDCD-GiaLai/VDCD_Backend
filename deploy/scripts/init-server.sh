#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# VDCD Backend — VPS Initial Setup Script
# Run this ONCE on a fresh Ubuntu 22.04/24.04 VPS as root
# Usage: curl -fsSL <url> | bash   OR   bash init-server.sh
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

# ── Configuration ──────────────────────────────────────────────
DEPLOY_USER="deploy"
DEPLOY_DIR="/opt/vdcd"
SSH_PORT="${1:-22}"              # Pass custom SSH port as first arg
DOMAIN="api.doimoisangtaogialai.vn"            # API subdomain
CERTBOT_EMAIL="kensarzero13@gmail.com"   # Email for Let's Encrypt notifications

echo "════════════════════════════════════════════════"
echo "  VDCD Backend — VPS Initial Setup"
echo "════════════════════════════════════════════════"
echo ""

# ── 1. System Update ──────────────────────────────────────────
echo "📦 [1/8] Updating system packages..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq
apt-get install -y -qq curl wget git htop unzip fail2ban ufw

# ── 2. Install Docker ─────────────────────────────────────────
echo "🐳 [2/8] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed: $(docker --version)"
else
    echo "   ✅ Docker already installed: $(docker --version)"
fi

# Install Docker Compose plugin (v2)
if ! docker compose version &> /dev/null; then
    apt-get install -y -qq docker-compose-plugin
    echo "   ✅ Docker Compose installed: $(docker compose version)"
else
    echo "   ✅ Docker Compose already installed: $(docker compose version)"
fi

# ── 3. Create Deploy User ─────────────────────────────────────
echo "👤 [3/8] Creating deploy user..."
if ! id "$DEPLOY_USER" &> /dev/null; then
    adduser --disabled-password --gecos "" "$DEPLOY_USER"
    usermod -aG docker "$DEPLOY_USER"

    # Setup SSH for deploy user
    mkdir -p /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh

    # Copy authorized keys from root (if exists)
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/authorized_keys
    fi
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true

    echo "   ✅ User '$DEPLOY_USER' created and added to docker group"
    echo ""
    echo "   ⚠️  IMPORTANT: Add your SSH public key to:"
    echo "      /home/$DEPLOY_USER/.ssh/authorized_keys"
    echo ""
else
    echo "   ✅ User '$DEPLOY_USER' already exists"
fi

# ── 4. Configure Firewall (UFW) ───────────────────────────────
echo "🔒 [4/8] Configuring firewall..."
ufw --force reset > /dev/null 2>&1
ufw default deny incoming
ufw default allow outgoing
ufw allow "$SSH_PORT/tcp" comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
echo "   ✅ Firewall configured — allowed ports: $SSH_PORT (SSH), 80 (HTTP), 443 (HTTPS)"

# ── 5. Configure SSH Security ─────────────────────────────────
echo "🔐 [5/8] Hardening SSH..."
SSHD_CONFIG="/etc/ssh/sshd_config"

# Change SSH port if not default
if [ "$SSH_PORT" != "22" ]; then
    sed -i "s/^#\?Port .*/Port $SSH_PORT/" "$SSHD_CONFIG"
fi

# Disable root login & password auth
sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin no/' "$SSHD_CONFIG"
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' "$SSHD_CONFIG"
sed -i 's/^#\?ChallengeResponseAuthentication .*/ChallengeResponseAuthentication no/' "$SSHD_CONFIG"
sed -i 's/^#\?UsePAM .*/UsePAM no/' "$SSHD_CONFIG"

systemctl restart sshd
echo "   ✅ SSH hardened — root login disabled, password auth disabled"

# ── 6. Configure Fail2Ban ─────────────────────────────────────
echo "🛡️  [6/8] Configuring Fail2Ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = ssh
logpath = /var/log/auth.log
EOF
systemctl enable fail2ban
systemctl restart fail2ban
echo "   ✅ Fail2Ban configured"

# ── 7. Create Deploy Directory Structure ──────────────────────
echo "📁 [7/8] Creating directory structure..."
mkdir -p "$DEPLOY_DIR"/{nginx,ssl/certbot/{conf,www},logs/{app,nginx,backup},backups,scripts}

# Copy deploy scripts
cat > "$DEPLOY_DIR/scripts/backup.sh" << 'BACKUP_SCRIPT'
#!/usr/bin/env bash
# VDCD Database Backup Script
set -euo pipefail

DEPLOY_DIR="/opt/vdcd"
BACKUP_DIR="$DEPLOY_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/vdcd_db_$DATE.sql.gz"
RETAIN_DAYS=${BACKUP_RETAIN_DAYS:-30}

echo "[$(date)] Starting database backup..."

# Dump database from PostgreSQL container
docker exec vdcd-postgres pg_dump -U "$DB_USER" -d "$DB_NAME" \
  --no-owner --no-privileges | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# Remove old backups
find "$BACKUP_DIR" -name "vdcd_db_*.sql.gz" -mtime +$RETAIN_DAYS -delete
REMAINING=$(find "$BACKUP_DIR" -name "vdcd_db_*.sql.gz" | wc -l)
echo "[$(date)] Cleanup done — $REMAINING backups retained"

echo "[$(date)] Backup complete ✅"
BACKUP_SCRIPT
chmod +x "$DEPLOY_DIR/scripts/backup.sh"

cat > "$DEPLOY_DIR/scripts/health-check.sh" << 'HEALTH_SCRIPT'
#!/usr/bin/env bash
# VDCD Health Check Script
# Add to crontab: */5 * * * * /opt/vdcd/scripts/health-check.sh

HEALTH_URL="http://localhost:3001/api/v1/health"
LOG_FILE="/opt/vdcd/logs/health-check.log"
ALERT_FILE="/opt/vdcd/.health-alert-sent"

check_health() {
    HTTP_CODE=$(curl -sf -o /dev/null -w '%{http_code}' "$HEALTH_URL" --max-time 10 2>/dev/null) || HTTP_CODE="000"
    echo "$HTTP_CODE"
}

CODE=$(check_health)

if [ "$CODE" = "200" ]; then
    # Service is healthy — clear alert flag if exists
    if [ -f "$ALERT_FILE" ]; then
        rm -f "$ALERT_FILE"
        echo "[$(date)] ✅ Service recovered — HTTP $CODE" >> "$LOG_FILE"
    fi
else
    echo "[$(date)] ❌ Health check FAILED — HTTP $CODE" >> "$LOG_FILE"

    # Only alert once (avoid spam)
    if [ ! -f "$ALERT_FILE" ]; then
        touch "$ALERT_FILE"
        echo "[$(date)] 🚨 ALERT SENT — Service is down!" >> "$LOG_FILE"

        # ── Add your notification here ──
        # Telegram example:
        # curl -s "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
        #   -d "chat_id=$CHAT_ID" \
        #   -d "text=🚨 VDCD Backend DOWN! HTTP: $CODE"
    fi
fi
HEALTH_SCRIPT
chmod +x "$DEPLOY_DIR/scripts/health-check.sh"

cat > "$DEPLOY_DIR/scripts/ssl-init.sh" << 'SSL_SCRIPT'
#!/usr/bin/env bash
# Initial SSL certificate setup with Let's Encrypt
# Run this ONCE after DNS is pointing to the server
set -euo pipefail

DOMAIN="${1:?Usage: $0 <domain> <email>}"
EMAIL="${2:?Usage: $0 <domain> <email>}"
DEPLOY_DIR="/opt/vdcd"

echo "🔐 Requesting SSL certificate for $DOMAIN..."

# Start nginx temporarily with HTTP-only config for ACME challenge
docker run --rm -d --name certbot-nginx \
  -p 80:80 \
  -v "$DEPLOY_DIR/ssl/certbot/www:/var/www/certbot" \
  nginx:alpine sh -c "echo 'server { listen 80; location /.well-known/acme-challenge/ { root /var/www/certbot; } }' > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

sleep 3

# Request certificate
docker run --rm \
  -v "$DEPLOY_DIR/ssl/certbot/conf:/etc/letsencrypt" \
  -v "$DEPLOY_DIR/ssl/certbot/www:/var/www/certbot" \
  certbot/certbot certonly \
    --webroot -w /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# Stop temporary nginx
docker stop certbot-nginx

echo "✅ SSL certificate obtained for $DOMAIN"
echo "   Certificate: $DEPLOY_DIR/ssl/certbot/conf/live/$DOMAIN/fullchain.pem"
echo "   Private key: $DEPLOY_DIR/ssl/certbot/conf/live/$DOMAIN/privkey.pem"
SSL_SCRIPT
chmod +x "$DEPLOY_DIR/scripts/ssl-init.sh"

# Set ownership
chown -R $DEPLOY_USER:$DEPLOY_USER "$DEPLOY_DIR"

echo "   ✅ Directory structure created at $DEPLOY_DIR"

# ── 8. Setup Cron Jobs ────────────────────────────────────────
echo "⏰ [8/8] Setting up cron jobs..."

# Add cron jobs for deploy user
CRON_CONTENT=$(crontab -u $DEPLOY_USER -l 2>/dev/null || echo "")
NEW_CRON="$CRON_CONTENT"

# Database backup — daily at 2:00 AM
if ! echo "$CRON_CONTENT" | grep -q "backup.sh"; then
    NEW_CRON="$NEW_CRON
# VDCD — Database backup (daily 2:00 AM)
0 2 * * * /opt/vdcd/scripts/backup.sh >> /opt/vdcd/logs/backup/cron.log 2>&1"
fi

# Health check — every 5 minutes
if ! echo "$CRON_CONTENT" | grep -q "health-check.sh"; then
    NEW_CRON="$NEW_CRON
# VDCD — Health check (every 5 min)
*/5 * * * * /opt/vdcd/scripts/health-check.sh"
fi

# Docker system prune — weekly on Sunday 3:00 AM
if ! echo "$CRON_CONTENT" | grep -q "docker system prune"; then
    NEW_CRON="$NEW_CRON
# VDCD — Docker cleanup (weekly Sunday 3:00 AM)
0 3 * * 0 docker system prune -f --filter 'until=168h' >> /opt/vdcd/logs/app/docker-prune.log 2>&1"
fi

echo "$NEW_CRON" | crontab -u $DEPLOY_USER -
echo "   ✅ Cron jobs configured"

# ── Summary ───────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════"
echo "  ✅ VPS Setup Complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "  📋 Next steps:"
echo ""
echo "  1. Add SSH public key to: /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "     ssh-copy-id -p $SSH_PORT $DEPLOY_USER@<server-ip>"
echo ""
echo "  2. Point DNS: $DOMAIN → $(curl -4 -sf ifconfig.me || echo '<server-ip>')"
echo ""
echo "  3. Get SSL certificate:"
echo "     sudo -u $DEPLOY_USER $DEPLOY_DIR/scripts/ssl-init.sh $DOMAIN $CERTBOT_EMAIL"
echo ""
echo "  4. Create .env file:"
echo "     cp $DEPLOY_DIR/.env.production.example $DEPLOY_DIR/.env"
echo "     nano $DEPLOY_DIR/.env"
echo ""
echo "  5. Copy docker-compose.prod.yml & nginx config to $DEPLOY_DIR/"
echo ""
echo "  6. Start services:"
echo "     cd $DEPLOY_DIR && docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "  7. Configure GitHub Secrets for CI/CD"
echo ""
echo "  SSH Port: $SSH_PORT"
echo "  Deploy User: $DEPLOY_USER"
echo "  Deploy Directory: $DEPLOY_DIR"
echo ""
