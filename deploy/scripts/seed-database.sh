#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# VDCD Backend — Automated Database Seed & Backup Script for VPS
# ═══════════════════════════════════════════════════════════════
# Usage:
#   bash seed-database.sh [OPTIONS]
# Options:
#   --mode <sql_file|typeorm_script>   Seed method (default: sql_file)
#   --backup <true|false>              Auto-backup DB before seed (default: true)
#   --clear-cache <true|false>         Flush Redis cache after seed (default: true)
#   --sql-file <path>                  Path to SQL file (default: /opt/vdcd/tmp/full-database-seed.sql)
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

# ── Color Codes ───────────────────────────────────────────────
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# ── Default Configurations ────────────────────────────────────
DEPLOY_DIR="/opt/vdcd"
MODE="sql_file"
DO_BACKUP="true"
DO_CLEAR_CACHE="true"
SQL_FILE="${DEPLOY_DIR}/tmp/full-database-seed.sql"

# ── Parse Arguments ───────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --mode)
      MODE="$2"
      shift 2
      ;;
    --backup)
      DO_BACKUP="$2"
      shift 2
      ;;
    --clear-cache)
      DO_CLEAR_CACHE="$2"
      shift 2
      ;;
    --sql-file)
      SQL_FILE="$2"
      shift 2
      ;;
    *)
      echo -e "${YELLOW}⚠️ Unknown option: $1${NC}"
      shift
      ;;
  esac
done

echo -e "${PURPLE}══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}            VDCD DATABASE SEED & SYNC RUNNER (VPS)                     ${NC}"
echo -e "${PURPLE}══════════════════════════════════════════════════════════════════════${NC}"
echo -e " 📅 Time       : $(date '+%Y-%m-%d %H:%M:%S')"
echo -e " ⚙️ Mode       : ${BLUE}${MODE}${NC}"
echo -e " 💾 Auto-backup: ${BLUE}${DO_BACKUP}${NC}"
echo -e " ⚡ Clear Cache: ${BLUE}${DO_CLEAR_CACHE}${NC}"
echo -e " 📄 SQL File   : ${BLUE}${SQL_FILE}${NC}"
echo -e "${PURPLE}──────────────────────────────────────────────────────────────────────${NC}"

# ── 1. Load Environment Variables from /opt/vdcd/.env ─────────
if [ -d "$DEPLOY_DIR" ]; then
  cd "$DEPLOY_DIR"
fi

if [ -f "$DEPLOY_DIR/.env" ]; then
  echo -e "${BLUE}🔍 [1/5] Loading environment variables from $DEPLOY_DIR/.env...${NC}"
  # Extract only DB and Redis variables safely
  DB_NAME=$(grep -E '^DB_NAME=' "$DEPLOY_DIR/.env" | cut -d'=' -f2- | tr -d '\r"' || echo "vdcd_db")
  DB_USER=$(grep -E '^DB_USER=' "$DEPLOY_DIR/.env" | cut -d'=' -f2- | tr -d '\r"' || echo "vdcd_user")
  REDIS_PASSWORD=$(grep -E '^REDIS_PASSWORD=' "$DEPLOY_DIR/.env" | cut -d'=' -f2- | tr -d '\r"' || echo "")
else
  echo -e "${YELLOW}⚠️ .env not found in $DEPLOY_DIR, using fallback defaults...${NC}"
  DB_NAME="${DB_NAME:-vdcd_db}"
  DB_USER="${DB_USER:-vdcd_user}"
  REDIS_PASSWORD="${REDIS_PASSWORD:-}"
fi

echo -e "    Target Database: ${GREEN}${DB_NAME}${NC} (User: ${GREEN}${DB_USER}${NC})"

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q '^vdcd-postgres$'; then
  echo -e "${RED}❌ ERROR: Container 'vdcd-postgres' is not running! Cannot proceed.${NC}"
  exit 1
fi

# ── 2. Automatic Database Backup ──────────────────────────────
if [ "$DO_BACKUP" = "true" ]; then
  echo -e "${BLUE}💾 [2/5] Performing automatic database backup...${NC}"
  BACKUP_DIR="${DEPLOY_DIR}/backups"
  mkdir -p "$BACKUP_DIR"
  
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="${BACKUP_DIR}/vdcd_db_pre_seed_${TIMESTAMP}.sql.gz"
  
  echo -e "    Backing up database '${DB_NAME}'..."
  docker exec vdcd-postgres pg_dump -U "$DB_USER" -d "$DB_NAME" \
    --no-owner --no-privileges | gzip > "$BACKUP_FILE"
  
  if [ -s "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "    ${GREEN}✅ Backup created successfully!${NC}"
    echo -e "    📁 File: ${BACKUP_FILE} (${BACKUP_SIZE})"
  else
    echo -e "${RED}❌ Backup failed or output file is empty! Aborting seed.${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}⏭️ [2/5] Auto-backup skipped (--backup false).${NC}"
fi

# ── 3. Execute Seeding ────────────────────────────────────────
echo -e "${BLUE}🌱 [3/5] Executing database seed (${MODE})...${NC}"

if [ "$MODE" = "sql_file" ]; then
  if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}❌ ERROR: SQL file not found at: ${SQL_FILE}${NC}"
    exit 1
  fi
  
  FILE_SIZE=$(du -h "$SQL_FILE" | cut -f1)
  echo -e "    Streaming ${SQL_FILE} (${FILE_SIZE}) into container 'vdcd-postgres'..."
  
  START_TIME=$(date +%s)
  docker exec -i vdcd-postgres psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 < "$SQL_FILE"
  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  
  echo -e "    ${GREEN}✅ SQL seed completed successfully in ${ELAPSED}s!${NC}"

elif [ "$MODE" = "typeorm_script" ]; then
  echo -e "    Running TypeORM seed script via container 'vdcd-backend'..."
  if docker ps --format '{{.Names}}' | grep -q '^vdcd-backend$'; then
    docker exec vdcd-backend pnpm seed:full:prod || \
    docker exec vdcd-backend node dist/database/seeds/full-database.seed.js
    echo -e "    ${GREEN}✅ TypeORM seed completed!${NC}"
  else
    echo -e "${RED}❌ Container 'vdcd-backend' is not running! Cannot run TypeORM script.${NC}"
    exit 1
  fi
else
  echo -e "${RED}❌ Unknown seed mode: ${MODE}${NC}"
  exit 1
fi

# ── 4. Verify Seed Results & Table Record Counts ──────────────
echo -e "${BLUE}📊 [4/5] Verifying database records...${NC}"

docker exec vdcd-postgres psql -U "$DB_USER" -d "$DB_NAME" -t -A -F" | " -c "
  SELECT '1. admin_user' as tbl, count(*)::text as cnt FROM \"admin_user\"
  UNION ALL SELECT '2. organization', count(*)::text FROM \"organization\"
  UNION ALL SELECT '3. operation_field', count(*)::text FROM \"operation_field\"
  UNION ALL SELECT '4. program', count(*)::text FROM \"program\"
  UNION ALL SELECT '5. solution', count(*)::text FROM \"solution\"
  UNION ALL SELECT '6. project', count(*)::text FROM \"project\"
  UNION ALL SELECT '7. project_image', count(*)::text FROM \"project_image\"
  UNION ALL SELECT '8. article', count(*)::text FROM \"article\"
  UNION ALL SELECT '9. partner', count(*)::text FROM \"partner\"
  UNION ALL SELECT '10. job', count(*)::text FROM \"job\"
  ORDER BY tbl;
" | while read -r line; do
  echo -e "    ${GREEN}•${NC} $line rows"
done

# ── 5. Clear Redis Cache & Health Check ───────────────────────
if [ "$DO_CLEAR_CACHE" = "true" ]; then
  echo -e "${BLUE}⚡ [5/5] Flushing Redis cache...${NC}"
  if docker ps --format '{{.Names}}' | grep -q '^vdcd-redis$'; then
    if [ -n "$REDIS_PASSWORD" ]; then
      docker exec vdcd-redis redis-cli -a "$REDIS_PASSWORD" FLUSHDB 2>/dev/null || true
    else
      docker exec vdcd-redis redis-cli FLUSHDB 2>/dev/null || true
    fi
    echo -e "    ${GREEN}✅ Redis cache flushed (FLUSHDB)!${NC}"
  else
    echo -e "    ${YELLOW}⚠️ Container 'vdcd-redis' not active, skipped.${NC}"
  fi
else
  echo -e "${YELLOW}⏭️ [5/5] Clear cache skipped (--clear-cache false).${NC}"
fi

# Check backend health
if docker ps --format '{{.Names}}' | grep -q '^vdcd-backend$'; then
  echo -e "🩺 Checking Backend Health..."
  if docker exec vdcd-backend wget -qO- -T 5 http://localhost:3001/api/v1/health > /dev/null 2>&1; then
    echo -e "    ${GREEN}✅ Backend is healthy and responding to /api/v1/health!${NC}"
  else
    echo -e "    ${YELLOW}⚠️ Backend health check did not return HTTP 200.${NC}"
  fi
fi

echo -e "${GREEN}══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}         🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!                   ${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════════════${NC}"
