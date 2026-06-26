# TOOLS.md — TRIZEN VPS layout

## Automation scripts (always prefer these)

| Script | Purpose |
|--------|---------|
| `/opt/trizen-automation/trizen-daily-news.sh` | Daily Valorant/esports news → blog draft |
| `/opt/trizen-automation/trizen-blog-import.sh <url> [category]` | Import one URL as draft |
| `/opt/trizen-automation/trizen-notify-telegram.sh "text"` | Send Telegram alert |

Env file: `/root/.trizen-automation.env`

## Shop

- Site: https://trizenstore.com.bd
- Admin blog: https://trizenstore.com.bd/admin/blog
- Blog import API creates **draft only** (`published: false`)

## News sources

- https://valorantesports.com/en-US/news/
- https://www.vlr.gg/
- https://liquipedia.net/valorant/

URL list (optional): `/root/trizen-news-urls.txt` (one URL per line)

## Cron

- Daily 9:00 AM Bangladesh = `0 3 * * *` UTC → `trizen-daily-news.sh`

## Exec rules

- Run scripts with `bash` from gateway host (full paths above).
- Do not publish blog posts — drafts only.
- Do not post to Facebook — captions only.
