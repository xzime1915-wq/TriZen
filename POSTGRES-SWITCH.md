# SQLite → PostgreSQL switch (TriZen)

Codebase **already uses PostgreSQL** in `prisma/schema.prisma`.  
You only need a **PostgreSQL `DATABASE_URL`** in `.env` (Supabase / Neon / local Postgres).

---

## ১. Free PostgreSQL (Supabase — recommended)

1. https://supabase.com → **New project**
2. **Settings → Database → Connection string → URI**
3. Copy the URL (looks like `postgresql://postgres.xxxx:PASSWORD@...`)

`.env`:

```env
DATABASE_URL="postgresql://....?sslmode=require"
```

Use the **direct** connection for `prisma db push` (not only pooler), or Supabase “Session mode” URI.

---

## ২. Create tables on PostgreSQL

```bash
cd f:/trizenweb1/trizenweb
npx prisma generate
npx prisma db push
```

---

## ৩. Data — choose one

### A) New shop only (no old orders) — easiest

```bash
npm run db:setup-safe
```

Products + admin upserted. Old SQLite orders are **not** copied.

### B) Copy everything from `prisma/dev.db`

1. Keep SQLite file at `prisma/dev.db`
2. Set PostgreSQL `DATABASE_URL` in `.env` first
3. Run:

```bash
npm install
npm run db:migrate-sqlite
```

This copies products, orders, customers, reviews, admin, users, settings.

---

## ৪. Run site

```bash
npm run dev
```

Open http://localhost:3000

---

## ৫. Netlify

Same `DATABASE_URL` in Netlify → **Environment variables**, then deploy.

Build command (already in repo): `npm run build:netlify`

---

## Local SQLite (old)

```env
# DATABASE_URL="file:./dev.db"   ← only works if schema provider is sqlite (not now)
```

Current schema is **postgresql only** — do not use `file:./dev.db` anymore.
