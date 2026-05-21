# TriZen Store

E-commerce for **TriZen Store** — TriPad glass mouse pads, checkout (COD / bKash / Nagad / bank), admin panel, invoices, and customer accounts.

## Quick start (development)

```bash
npm install
cp .env.example .env
# Edit .env — set ADMIN_PASSWORD, JWT_SECRET, wallet numbers

npx prisma db push
npm run db:seed

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

## Production deploy

See **[DEPLOY.md](./DEPLOY.md)** for the full checklist (Railway, env vars, safe DB setup).

**Never** run `db:seed` in production — it deletes all orders. Use:

```bash
npm run db:setup-safe
```

## Features

- Storefront: home, shop, product pages, cart, checkout
- TriPad V1 (in stock) + V2 (upcoming)
- Orders + track order + confirmation (email required)
- Admin: products, orders, customers, settings, PDF invoice
- Customer sign-in (email/password + optional Google OAuth)

## Tech stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- Prisma + SQLite (single-server deploy) or PostgreSQL for serverless
- Zustand cart, Jose JWT sessions

## Security (built-in)

- Admin routes protected by middleware + JWT (`role: admin`)
- Production env validation on startup
- Order confirmation requires customer email
- Rate limits on orders, admin login, reviews
- Google OAuth `state` CSRF protection
- Destructive seed blocked in production

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run db:push` | Apply Prisma schema |
| `npm run db:seed` | Dev: reset DB + sample data |
| `npm run db:setup-safe` | Prod: upsert products without wiping orders |
| `npm run db:upsert-v2` | Upsert TriPad V2 products only |
