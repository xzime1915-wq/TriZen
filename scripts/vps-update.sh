#!/usr/bin/env bash
# Run on VPS only: cd /var/www/trizen && bash scripts/vps-update.sh
set -e

cd "$(dirname "$0")/.."
echo "=== TriZen VPS update ==="
echo "Folder: $(pwd)"
echo ""

echo ">>> Git pull..."
git fetch origin main
git reset --hard origin/main
git log -1 --oneline
echo ""

echo ">>> Sync database schema (Prisma)..."
npx prisma generate
npx prisma db push --accept-data-loss
echo ""

echo ">>> Build (may take 2-3 min)..."
rm -rf .next
npm run build
echo ""

echo ">>> Restart app..."
pm2 restart trizen || pm2 start ecosystem.config.cjs
pm2 status
echo ""
echo "=== Done. Open http://144.79.133.209 and hard refresh (Ctrl+Shift+R) ==="
