---
name: trizen-store
description: TRIZEN Store blog draft automation — import esports news URLs, run daily news batch, send Telegram alerts. Use when owner asks for Valorant news, blog draft, ajker news, or paste a news URL.
---

# TRIZEN Store automation

## When to use

Owner messages about:
- blog draft, news draft, ajker valorant news, daily news
- paste of valorantesports.com / vlr.gg / liquipedia URL
- FB caption for a published/draft article

## Commands (run via exec)

**Daily batch:**
```bash
bash /opt/trizen-automation/trizen-daily-news.sh
```

**Single URL:**
```bash
bash /opt/trizen-automation/trizen-blog-import.sh "URL_HERE" "Esports"
```

**Notify only:**
```bash
bash /opt/trizen-automation/trizen-notify-telegram.sh "message"
```

## Response format

After running, reply with:
1. ✅ or ❌ status
2. Draft title + admin link if created
3. One-line FB caption suggestion with `#VALORANT #TRIZENSTORE`

## Rules

- Never set blog posts to published.
- Never post to Facebook automatically.
- Do not ask clarifying questions for obvious draft requests — run the script.
