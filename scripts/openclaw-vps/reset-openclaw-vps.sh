#!/usr/bin/env bash
# Full reset OpenClaw VPS to clean state (NOT shop VPS).
# Run as root on OpenClaw VPS only: bash reset-openclaw-vps.sh
set -euo pipefail
echo "=== OpenClaw VPS FULL CLEAN ==="
echo "Hostname: $(hostname)"
echo ""

echo ">>> Stop services..."
systemctl stop trizen-telegram-bot 2>/dev/null || true
systemctl disable trizen-telegram-bot 2>/dev/null || true
systemctl --user stop openclaw-gateway 2>/dev/null || true
systemctl --user disable openclaw-gateway 2>/dev/null || true
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

echo ">>> Remove TRIZEN automation..."
rm -rf /opt/trizen-automation
rm -f /root/.trizen-automation.env
rm -f /root/trizen-news-urls.txt
rm -f /var/log/trizen-daily-news.log

echo ">>> Clear crontab..."
crontab -r 2>/dev/null || true

echo ">>> Remove OpenClaw state..."
rm -rf /root/.openclaw
rm -rf /tmp/openclaw
rm -rf /var/tmp/openclaw-compile-cache

echo ">>> Remove systemd units..."
rm -f /etc/systemd/system/trizen-telegram-bot.service
rm -f /root/.config/systemd/user/openclaw-gateway.service*
systemctl daemon-reload
systemctl --user daemon-reload 2>/dev/null || true

echo ">>> Uninstall OpenClaw npm package..."
npm uninstall -g openclaw 2>/dev/null || true

echo ">>> Remove Ollama models (keep Ollama daemon)..."
if command -v ollama >/dev/null; then
  ollama list 2>/dev/null | awk 'NR>1 {print $1}' | while read -r m; do
    [[ -n "$m" ]] && ollama rm "$m" 2>/dev/null || true
  done
fi

echo ">>> Clean bashrc OpenClaw env lines..."
sed -i '/NODE_COMPILE_CACHE/d;/OPENCLAW_NO_RESPAWN/d' /root/.bashrc 2>/dev/null || true

echo ""
echo "=== DONE — VPS is clean ==="
echo "Remaining: Ubuntu + Ollama daemon (empty) + Node.js"
echo ""
echo "Fresh setup:"
echo "  npm install -g openclaw@latest"
echo "  openclaw onboard"
echo "  → Choose: Ollama → Local only → pick model"
echo ""
