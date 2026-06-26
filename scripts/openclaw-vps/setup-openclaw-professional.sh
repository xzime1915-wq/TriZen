#!/usr/bin/env bash
# Professional OpenClaw setup for TRIZEN Store VPS.
# Run on OpenClaw VPS as root: bash /opt/trizen-automation/setup-openclaw-professional.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OPENCLAW_JSON="/root/.openclaw/openclaw.json"
WORKSPACE="/root/.openclaw/workspace"
ENV_FILE="/root/.trizen-automation.env"

echo "=== TRIZEN OpenClaw professional setup ==="

# Performance env for small VPS
grep -q 'NODE_COMPILE_CACHE' /root/.bashrc 2>/dev/null || cat >> /root/.bashrc <<'EOF'
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1
EOF
mkdir -p /var/tmp/openclaw-compile-cache
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1

echo ">>> Pull tool-capable model (qwen2.5:7b)..."
ollama pull qwen2.5:7b
# Remove weak tiny model to free disk
ollama rm llama3.2:3b 2>/dev/null || true

echo ">>> Patch OpenClaw config..."
python3 <<'PY'
import json
from pathlib import Path

path = Path("/root/.openclaw/openclaw.json")
cfg = json.loads(path.read_text())

# Ollama native API (NOT /v1 — breaks tool calling)
cfg.setdefault("models", {}).setdefault("providers", {})["ollama"] = {
    "baseUrl": "http://127.0.0.1:11434",
    "apiKey": "ollama-local",
    "api": "ollama",
    "timeoutSeconds": 300,
    "models": [
        {
            "id": "qwen2.5:7b",
            "name": "qwen2.5:7b",
            "input": ["text"],
            "params": {"num_ctx": 8192, "thinking": False, "keep_alive": "10m"},
        }
    ],
}

cfg.setdefault("agents", {}).setdefault("defaults", {})
cfg["agents"]["defaults"]["model"] = {"primary": "ollama/qwen2.5:7b"}
cfg["agents"]["defaults"]["workspace"] = "/root/.openclaw/workspace"
cfg["agents"]["defaults"].setdefault("memorySearch", {})["enabled"] = False

# Tools: coding profile + gateway exec for automation scripts
cfg["tools"] = {
    "profile": "coding",
    "exec": {
        "host": "gateway",
        "security": "full",
        "ask": "off",
        "timeoutSec": 300,
        "notifyOnExit": True,
    },
}

# Telegram — owner only
token = ""
chat_id = ""
env = Path("/root/.trizen-automation.env")
if env.is_file():
    for line in env.read_text().splitlines():
        if line.startswith("TELEGRAM_BOT_TOKEN="):
            token = line.split("=", 1)[1].strip().strip('"')
        if line.startswith("TELEGRAM_CHAT_ID="):
            chat_id = line.split("=", 1)[1].strip().strip('"')

cfg.setdefault("channels", {}).setdefault("telegram", {})
cfg["channels"]["telegram"].update({
    "enabled": True,
    "name": "TRIZEN OpenClaw",
    "botToken": token or cfg["channels"]["telegram"].get("botToken", ""),
})

cfg.setdefault("plugins", {}).setdefault("entries", {})
cfg["plugins"]["entries"]["telegram"] = {"enabled": True}
cfg["plugins"]["entries"]["ollama"] = {"enabled": True}

cfg.setdefault("commands", {})
cfg["commands"]["ownerAllowFrom"] = [f"telegram:{chat_id}"] if chat_id else cfg.get("commands", {}).get("ownerAllowFrom", [])

# Enable trizen-store skill
cfg.setdefault("skills", {}).setdefault("entries", {})
cfg["skills"]["entries"]["trizen-store"] = {"enabled": True}

path.write_text(json.dumps(cfg, indent=2) + "\n")
print("Config patched.")
PY

echo ">>> Workspace files..."
cp -f "$SCRIPT_DIR/openclaw-workspace-AGENTS.md" "$WORKSPACE/AGENTS.md"
cp -f "$SCRIPT_DIR/openclaw-workspace-USER.md" "$WORKSPACE/USER.md"
cp -f "$SCRIPT_DIR/openclaw-workspace-IDENTITY.md" "$WORKSPACE/IDENTITY.md"
cp -f "$SCRIPT_DIR/openclaw-workspace-TOOLS.md" "$WORKSPACE/TOOLS.md"

mkdir -p "$WORKSPACE/skills/trizen-store"
cp -f "$SCRIPT_DIR/skills/trizen-store/SKILL.md" "$WORKSPACE/skills/trizen-store/SKILL.md"

echo ">>> Clear stale agent sessions..."
rm -rf /root/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null || true
rm -f /root/.openclaw/agents/main/sessions/sessions.json 2>/dev/null || true

echo ">>> Stop fallback bot (same Telegram token)..."
systemctl stop trizen-telegram-bot 2>/dev/null || true
systemctl disable trizen-telegram-bot 2>/dev/null || true

echo ">>> OpenClaw doctor fix..."
openclaw doctor --fix 2>&1 | tail -5 || true

echo ">>> Install / restart gateway..."
loginctl enable-linger root 2>/dev/null || true
openclaw gateway install 2>/dev/null || true
systemctl --user daemon-reload
systemctl --user enable openclaw-gateway
systemctl --user restart openclaw-gateway
sleep 3

echo ">>> Verify..."
openclaw models list --provider ollama 2>&1 | head -5
systemctl --user is-active openclaw-gateway
openclaw infer model run --model ollama/qwen2.5:7b --prompt "Reply with exactly: TRIZEN OK" 2>&1 | tail -5

echo ""
echo "=== Done ==="
echo "Telegram: message @trizen_openclaw_bot — try 'ajker news draft koro'"
echo "Dashboard: ssh -L 18789:127.0.0.1:18789 root@$(hostname -I | awk '{print $1}')"
echo "           http://127.0.0.1:18789 + gateway token"
