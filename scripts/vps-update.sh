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

echo ">>> Install dependencies (package.json / lockfile)..."
npm ci 2>/dev/null || npm install
echo ""

echo ">>> Sync database schema (Prisma)..."
if node - <<'NODE'
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const columns = await prisma.$queryRawUnsafe("PRAGMA table_info('Product')");
  const hasBarcode = columns.some((column) => column.name === "barcode");
  process.exit(hasBarcode ? 0 : 1);
}

main()
  .catch(() => process.exit(1))
  .finally(() => prisma.$disconnect());
NODE
then
  echo "Inventory identifiers already present."
else
  echo "Applying inventory identifier backfill..."
  npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/20260626000000_inventory_identifiers/migration.sql
  npx prisma migrate resolve --applied 20260626000000_inventory_identifiers || true
fi
npx prisma generate
npx prisma db push --accept-data-loss
echo ""

echo ">>> Sync TriPad names & SKU in database..."
npm run db:rename-tripad
echo ""

echo ">>> Upsert PTFE mouse skates product..."
npm run db:upsert-ptfe-skates
echo ""

echo ">>> Build (may take 2-3 min)..."
rm -rf .next
npm run build
echo ""

echo ">>> Restart app (reload .env from ecosystem.config.cjs)..."
pm2 delete trizen 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
echo ""
echo "=== Done. Open http://144.79.133.209 and hard refresh (Ctrl+Shift+R) ==="
