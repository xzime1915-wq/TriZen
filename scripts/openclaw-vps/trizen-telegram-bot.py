#!/usr/bin/env python3
"""TRIZEN Telegram bot — runs automation scripts (no LLM).

Commands / keywords:
  /draft, /news, draft, news, ajker news  → trizen-daily-news.sh
  /help                                     → help text
  https://...                               → trizen-blog-import.sh <url>
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ENV_FILE = Path(os.environ.get("TRIZEN_ENV_FILE", "/root/.trizen-automation.env"))
AUTOMATION = Path("/opt/trizen-automation")
POLL_TIMEOUT = 50
DRAFT_RE = re.compile(
    r"(?i)(/draft|/news|draft|news|ajker|valorant|blog\s*draft|news\s*draft)",
)
URL_RE = re.compile(r"https?://[^\s<>\"']+")


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.is_file():
        return env
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        val = val.strip().strip('"').strip("'")
        env[key.strip()] = val
    return env


def tg_api(token: str, method: str, payload: dict | None = None) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload or {}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data if payload else None,
        headers={"Content-Type": "application/json"},
        method="POST" if payload else "GET",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    if not body.get("ok"):
        raise RuntimeError(body.get("description", "Telegram API error"))
    return body


def send_message(token: str, chat_id: str | int, text: str) -> None:
    # Telegram limit 4096 chars
    chunk = text[:4000]
    tg_api(token, "sendMessage", {"chat_id": chat_id, "text": chunk})


def run_script(script: str, *args: str) -> tuple[int, str]:
    cmd = [str(AUTOMATION / script), *args]
    proc = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=300,
    )
    out = (proc.stdout or "") + (proc.stderr or "")
    return proc.returncode, out.strip() or "(no output)"


def handle_text(text: str) -> str:
    text = text.strip()
    if not text:
        return ""

    lower = text.lower()
    if lower in ("/start", "/help", "help", "hi", "hello"):
        return (
            "TRIZEN automation bot\n\n"
            "• /draft or 'ajker news draft' → today's blog draft\n"
            "• Send a news URL → import as draft\n"
            "• Daily auto: 9:00 AM Bangladesh\n\n"
            "Admin: https://trizenstore.com.bd/admin/blog"
        )

    url_match = URL_RE.search(text)
    if url_match:
        url = url_match.group(0).rstrip(".,)")
        code, out = run_script("trizen-blog-import.sh", url, "Esports")
        if code == 0:
            return f"✅ Blog draft created\n\n{out}"
        return f"❌ Import failed\n\n{out[:3500]}"

    if DRAFT_RE.search(text):
        send_progress = "⏳ Running daily news import…"
        code, out = run_script("trizen-daily-news.sh")
        if code == 0:
            return f"✅ Done\n\n{out[-3500:]}"
        return f"❌ Failed\n\n{out[:3500]}"

    return (
        "Didn't understand. Try:\n"
        "• /draft — create today's news draft\n"
        "• paste a Valorant news URL"
    )


def main() -> int:
    env = load_env()
    token = env.get("TELEGRAM_BOT_TOKEN", "")
    owner_id = env.get("TELEGRAM_CHAT_ID", "")

    if not token or not owner_id:
        print(f"Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in {ENV_FILE}", file=sys.stderr)
        return 1

    print(f"TRIZEN bot polling (owner chat {owner_id})…", flush=True)
    offset: int | None = None

    while True:
        try:
            params = {"timeout": POLL_TIMEOUT, "allowed_updates": ["message"]}
            if offset is not None:
                params["offset"] = offset
            qs = urllib.parse.urlencode(params)
            url = f"https://api.telegram.org/bot{token}/getUpdates?{qs}"
            with urllib.request.urlopen(url, timeout=POLL_TIMEOUT + 10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if not data.get("ok"):
                raise RuntimeError(data.get("description", "getUpdates failed"))

            for update in data.get("result", []):
                offset = update["update_id"] + 1
                msg = update.get("message") or {}
                chat = msg.get("chat") or {}
                chat_id = str(chat.get("id", ""))
                text = (msg.get("text") or "").strip()

                if chat_id != str(owner_id):
                    send_message(token, chat_id, "Unauthorized.")
                    continue

                if not text:
                    continue

                print(f"Message: {text[:80]}", flush=True)
                try:
                    reply = handle_text(text)
                    if reply:
                        send_message(token, chat_id, reply)
                except subprocess.TimeoutExpired:
                    send_message(token, chat_id, "❌ Timed out (>5 min). Check VPS logs.")
                except Exception as exc:
                    send_message(token, chat_id, f"❌ Error: {exc}")

        except urllib.error.URLError as exc:
            print(f"Network error: {exc}", flush=True)
            time.sleep(5)
        except Exception as exc:
            print(f"Loop error: {exc}", flush=True)
            time.sleep(5)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
