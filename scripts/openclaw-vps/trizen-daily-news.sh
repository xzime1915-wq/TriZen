#!/usr/bin/env bash
# Daily esports news → blog drafts + Telegram notify.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="/var/log/trizen-daily-news.log"
exec >>"$LOG" 2>&1
echo "=== $(date -Is) daily news ==="

# Add article URLs here (or /root/trizen-news-urls.txt one per line)
URLS_FILE="/root/trizen-news-urls.txt"
if [[ -f "$URLS_FILE" ]]; then
  mapfile -t URLS < <(grep -E '^https?://' "$URLS_FILE" | head -5)
else
  URLS=(
    "https://valorantesports.com/en-US/news/"
  )
fi

for url in "${URLS[@]}"; do
  echo "Importing: $url"
  "$SCRIPT_DIR/trizen-blog-import.sh" "$url" "Esports" || echo "Failed: $url"
  sleep 2
done

echo "Done."
