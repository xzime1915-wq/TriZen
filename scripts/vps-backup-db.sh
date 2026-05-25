#!/usr/bin/env bash
# SQLite backup for TriZen VPS.
# Run: cd /var/www/trizen && bash scripts/vps-backup-db.sh
#
# Daily cron (3 AM):
#   crontab -e
#   0 3 * * * cd /var/www/trizen && bash scripts/vps-backup-db.sh >> /var/log/trizen-backup.log 2>&1
#
# Restore example:
#   pm2 stop trizen
#   gunzip -c backups/trizen-YYYYMMDD-HHMMSS.db.gz > prisma/dev.db
#   pm2 start ecosystem.config.cjs

set -euo pipefail

cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found in $APP_DIR"
  exit 1
fi

DATABASE_URL="$(
  grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '\r' | sed 's/^["'\'']//;s/["'\'']$//'
)"

if [[ "$DATABASE_URL" != file:* ]]; then
  echo "ERROR: DATABASE_URL must be SQLite (file:...). Found: $DATABASE_URL"
  exit 1
fi

DB_PATH="${DATABASE_URL#file:}"
if [[ "$DB_PATH" != /* ]]; then
  DB_PATH="$APP_DIR/$DB_PATH"
fi

if [[ ! -f "$DB_PATH" ]]; then
  echo "ERROR: Database file not found: $DB_PATH"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_DIR/trizen-$STAMP.db"

echo "=== TriZen database backup ==="
echo "Source: $DB_PATH"
echo "Target: $DEST.gz"

if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_PATH" ".backup '$DEST'"
else
  echo "WARN: sqlite3 not installed — using cp (stop traffic during heavy writes if possible)"
  cp "$DB_PATH" "$DEST"
fi

gzip -f "$DEST"
ls -lh "$DEST.gz"

find "$BACKUP_DIR" -name 'trizen-*.db.gz' -type f -mtime +"$KEEP_DAYS" -delete 2>/dev/null || true

COUNT="$(find "$BACKUP_DIR" -name 'trizen-*.db.gz' -type f | wc -l)"
echo "Backups kept (last ${KEEP_DAYS} days): $COUNT file(s) in $BACKUP_DIR"
echo "=== Done ==="
