#!/usr/bin/env bash
# Import a news URL into trizenstore blog as draft.
set -euo pipefail
ENV_FILE="${TRIZEN_ENV_FILE:-/root/.trizen-automation.env}"
# shellcheck disable=SC1090
[[ -f "$ENV_FILE" ]] && source "$ENV_FILE"

URL="${1:-}"
CATEGORY="${2:-Esports}"

if [[ -z "$URL" ]]; then
  echo "Usage: $0 <article_url> [category]"
  exit 1
fi

SITE="${TRIZEN_SITE_URL:-https://trizenstore.com.bd}"
COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" -X POST "${SITE}/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "$(python3 -c "import json,sys; print(json.dumps({'email':sys.argv[1],'password':sys.argv[2]}))" "$TRIZEN_ADMIN_EMAIL" "$TRIZEN_ADMIN_PASSWORD")" \
  | grep -q '"ok":true' || { echo "Admin login failed"; exit 1; }

RESP=$(curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" -X POST "${SITE}/api/admin/blog/import" \
  -H "Content-Type: application/json" \
  -d "$(python3 -c "import json,sys; print(json.dumps({'url':sys.argv[1],'category':sys.argv[2]}))" "$URL" "$CATEGORY")")

TITLE=$(echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('title',''))" 2>/dev/null || true)
SLUG=$(echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('slug',''))" 2>/dev/null || true)

if [[ -z "$SLUG" ]]; then
  echo "Import failed: $RESP"
  exit 1
fi

echo "Draft: $TITLE"
echo "Admin: ${SITE}/admin/blog"
echo "Preview: ${SITE}/blog/${SLUG}"

# FB caption stub
CAPTION="📰 ${TITLE}

New on TRIZEN blog — review & publish when ready.
${SITE}/blog/${SLUG}

#VALORANT #Esports #TRIZENSTORE"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
"$SCRIPT_DIR/trizen-notify-telegram.sh" "$CAPTION" || true
