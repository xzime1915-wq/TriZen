#!/usr/bin/env bash
# Run on VPS: cd /var/www/trizen && bash scripts/vps-fix-google-oauth.sh
set -e
cd "$(dirname "$0")/.."

echo "=== Fix Google OAuth env on VPS ==="

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found"
  exit 1
fi

# Force live URLs (never localhost on production)
grep -q '^APP_URL=' .env && sed -i 's|^APP_URL=.*|APP_URL="https://trizenstore.com.bd"|' .env || echo 'APP_URL="https://trizenstore.com.bd"' >> .env
grep -q '^NEXT_PUBLIC_APP_URL=' .env && sed -i 's|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL="https://trizenstore.com.bd"|' .env || echo 'NEXT_PUBLIC_APP_URL="https://trizenstore.com.bd"' >> .env

if ! grep -q '^GOOGLE_CLIENT_ID=.' .env; then
  echo ""
  echo "ERROR: GOOGLE_CLIENT_ID is missing in .env"
  echo "Run: nano .env"
  echo "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from your local PC .env"
  exit 1
fi

if ! grep -q '^GOOGLE_CLIENT_SECRET=.' .env; then
  echo "ERROR: GOOGLE_CLIENT_SECRET is missing in .env"
  exit 1
fi

echo "APP_URL=$(grep ^APP_URL= .env)"
echo "GOOGLE_CLIENT_ID=$(grep ^GOOGLE_CLIENT_ID= .env | cut -c1-40)..."

git pull
bash scripts/vps-update.sh
pm2 delete trizen 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo ""
echo "=== Done. Test: https://trizenstore.com.bd/sign-in ==="
