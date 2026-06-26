# TRIZEN Store — Agent Handoff (Codex / any AI)

Read this first. Owner: **TriZen Store** (Bangladesh). Live site: **https://trizenstore.com.bd**

---

## 1. Two separate VPS servers (do not mix)

| VPS | IP | Purpose | Password in `.env.vps` |
|-----|-----|---------|------------------------|
| **Shop** | `144.79.133.209` | trizenstore.com.bd (Next.js + PM2) | `VPS_SSH_PASSWORD` |
| **OpenClaw** | `144.79.133.236` | Automation only (was reset to clean Ubuntu) | `OPENCLAW_VPS_PASSWORD` |

Shop path on server: `/var/www/trizen`

---

## 2. What this repo is

- **Next.js 15** e-commerce: TriPad mouse pads, cart, checkout (COD/bKash/Nagad), admin, blog, reviews
- **DB:** SQLite on VPS (`DATABASE_URL=file:./prod.db`)
- **Deploy:** GitHub → VPS pull → build → PM2 (`scripts/vps-update.sh`, `scripts/deploy-auto.py`)
- **Secrets:** `.env.vps` (local only, gitignored) — never commit

---

## 3. Owner goals (automation)

1. Valorant/esports news → **blog drafts** on trizenstore (owner publishes manually)
2. **FB captions** generated; owner posts manually (no auto FB)
3. Prefer **free** local AI (Ollama) — avoid paid OpenAI/Anthropic on VPS
4. Control via **Telegram** when PC is off
5. **Cursor Pro** is for dev in IDE — not a drop-in API for OpenClaw/Ollama

---

## 4. Shop site — important paths

| Area | Path |
|------|------|
| Checkout (email verify + cart bug fixed) | `src/app/checkout/page.tsx` |
| Blog import API (creates draft) | `src/app/api/admin/blog/import` |
| Review invite email | `src/lib/review-invite.ts` |
| SMTP / email | `src/lib/email.ts` |
| PM2 config | `ecosystem.config.cjs` |
| VPS deploy script | `scripts/vps-update.sh` |
| One-click deploy from PC | `python scripts/deploy-auto.py` |

### Deploy from Windows PC

```bash
python scripts/deploy-auto.py
```

Reads `VPS_SSH_PASSWORD` from `.env.vps`, git push, SSH to shop VPS, runs `vps-update.sh`.

### Admin credentials

In `.env.vps`: `ADMIN_EMAIL`, `ADMIN_PASSWORD` — also used by automation scripts for blog import.

---

## 5. OpenClaw / automation history

**Current state (as of handoff):** OpenClaw VPS was **fully wiped** — no Node, no Ollama, no OpenClaw. Like a fresh VPS.

Scripts still in repo (for re-deploy when owner asks):

| File | Purpose |
|------|---------|
| `scripts/openclaw-vps/trizen-blog-import.sh` | Login + POST blog import → draft + Telegram |
| `scripts/openclaw-vps/trizen-daily-news.sh` | Daily batch import |
| `scripts/openclaw-vps/trizen-notify-telegram.sh` | Send Telegram message |
| `scripts/openclaw-vps/trizen-telegram-bot.py` | Simple command bot (no LLM) — reliable fallback |
| `scripts/openclaw-vps/setup-openclaw-professional.sh` | OpenClaw + qwen2.5:7b setup (was tried) |
| `scripts/openclaw-vps/reset-openclaw-vps.sh` | Full clean OpenClaw VPS |

### Lessons learned

- `llama3.2:3b` too weak for agent/tasks
- `qwen2.5:7b` better but slow on 8GB VPS
- OpenClaw + free Ollama ≠ ChatGPT-level assistant
- **Reliable path:** cron + shell scripts + optional simple Telegram bot (no LLM)
- Cursor API key (dashboard) ≠ OpenAI key; used for Cursor Agent API only

### Telegram bot (when configured)

- Bot: `@trizen_openclaw_bot`
- Token + chat ID in `.env.vps` as `OPENCLAW_TELEGRAM_*`

---

## 6. Credentials map (all in `.env.vps`, never commit)

- Shop VPS SSH, OpenClaw VPS SSH
- Admin login, JWT, Google OAuth
- SMTP (support@trizenstore.com.bd)
- bKash/Nagad display numbers
- OpenClaw/Telegram tokens

---

## 7. What NOT to do

- Do not run `npm run db:seed` on production
- Do not commit `.env.vps` or `.env`
- Do not force-push main
- Do not mix shop VPS (209) with OpenClaw VPS (236)
- Do not auto-publish blog posts — drafts only
- Do not auto-post to Facebook without owner approval

---

## 8. Pending / not built yet

- Poster/image generation for FB
- Facebook Page Messenger AI auto-reply (needs Meta webhook + app review)
- Fresh OpenClaw setup on 236 (owner reset VPS; may use Cursor API or Ollama later)

---

## 9. How to onboard Codex (paste this prompt)

```
You are working on TRIZEN Store (trizenstore.com.bd).

Read CODEX-HANDOFF.md in the repo root first, then:
- DEPLOY.md for production deploy
- scripts/openclaw-vps/ for automation scripts

Two VPS: shop 144.79.133.209, OpenClaw 144.79.133.236 (currently clean).
Secrets in .env.vps (gitignored) — ask owner to fill if missing.

Match existing code style. Minimal diffs. Deploy shop changes via scripts/deploy-auto.py when owner asks.

Owner language: Bengali/English mix. Be direct, no fluff.
```

---

## 10. Key URLs

- Store: https://trizenstore.com.bd
- Admin: https://trizenstore.com.bd/admin
- Admin blog: https://trizenstore.com.bd/admin/blog
- GitHub: https://github.com/xzime1915-wq/TriZen
