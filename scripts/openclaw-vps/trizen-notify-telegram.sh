#!/usr/bin/env bash
# Send text (and optional image) to Telegram.
set -euo pipefail
ENV_FILE="${TRIZEN_ENV_FILE:-/root/.trizen-automation.env}"
# shellcheck disable=SC1090
[[ -f "$ENV_FILE" ]] && source "$ENV_FILE"

TEXT="${1:-}"
IMAGE="${2:-}"

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_CHAT_ID:-}" ]]; then
  echo "SKIP: Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in $ENV_FILE"
  exit 0
fi

if [[ -z "$TEXT" ]]; then
  echo "Usage: $0 \"message\" [image_path]"
  exit 1
fi

if [[ -n "$IMAGE" && -f "$IMAGE" ]]; then
  curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto" \
    -F "chat_id=${TELEGRAM_CHAT_ID}" \
    -F "caption=${TEXT}" \
    -F "photo=@${IMAGE}" >/dev/null
else
  curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json,sys; print(json.dumps({'chat_id':'${TELEGRAM_CHAT_ID}','text':sys.argv[1]}))" "$TEXT")" >/dev/null
fi

echo "Telegram sent."
