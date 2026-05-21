# TriZen Store — Production deploy guide

## Pre-flight checklist

- [ ] Copy `.env.example` → `.env` and fill all values
- [ ] `JWT_SECRET` — at least 32 random characters (`openssl rand -hex 32`)
- [ ] Strong `ADMIN_PASSWORD` (not the old default)
- [ ] `APP_URL` = your live URL (e.g. `https://trizenstore.com`)
- [ ] Google OAuth redirect: `https://YOUR_DOMAIN/api/auth/google/callback`
- [ ] Rotate Google secrets if they were ever committed to git

## Local production test

```bash
npm install
npx prisma db push
npm run db:setup-safe
npm run build
npm start
```

Open http://localhost:3000

## Recommended hosting: Railway (keeps SQLite)

1. Push code to GitHub
2. [railway.app](https://railway.app) → New Project → Deploy from repo
3. Add **Volume**, mount path: `/data`
4. Variables:

```env
DATABASE_URL=file:/data/prod.db
NODE_ENV=production
JWT_SECRET=your-64-char-secret
ADMIN_EMAIL=you@domain.com
APP_URL=https://your-app.up.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
NEXT_PUBLIC_BKASH_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_NAGAD_NUMBER=01XXXXXXXXX
```

5. Build command:

```bash
npm install && npx prisma db push && npm run build
```

6. Start command: `npm start`

7. One-time setup (Railway shell):

```bash
npm run db:setup-safe
```

Set `ADMIN_PASSWORD` in variables first if creating admin.

## After deploy

1. Login: `/admin/login`
2. **Admin → Settings** — bank, shipping, store info
3. Test: shop → cart → checkout → order confirmation (needs `?email=` in URL)
4. Never run `npm run db:seed` on production (wipes orders)

## Scripts

| Command | Use |
|---------|-----|
| `npm run db:seed` | **Dev only** — wipes DB, recreates products + admin |
| `npm run db:setup-safe` | **Production** — upsert products, keep orders |
| `npm run db:upsert-v2` | Update TriPad V2 only |

## Netlify

**SQLite does not work on Netlify.** Follow **[NETLIFY-SETUP.md](./NETLIFY-SETUP.md)** (Neon PostgreSQL + env vars + `netlify.toml`).

## Vercel note

Use PostgreSQL (Neon) on Vercel as well, or Railway/VPS for simpler SQLite hosting.
