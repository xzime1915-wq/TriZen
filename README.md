# TriZen Store

E-commerce for TriZen Store: TriPad glass mouse pads, checkout, admin panel, invoices, live chat, customer accounts, and product management.

## Fresh Windows Setup

On a new Windows install, run this first:

```bat
scripts\setup-windows-tools.bat
```

If Windows asks for admin permission, approve it. After it finishes, close the terminal and open a new CMD or PowerShell so Git, Node.js, npm, and Python are available in PATH.

## Run Locally

Fast path:

```bat
scripts\localhost.bat
```

Manual path:

```bash
npm install
copy .env.example .env
# Edit .env, then:
npx prisma db push
npm run db:setup-safe
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login). Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

## Before Push Or Deploy

Run:

```bat
scripts\prepare-deploy.bat
```

This verifies dependencies, Prisma, typecheck, and production build.

Push only:

```bat
scripts\publish-git.bat
```

Push and VPS deploy:

```bat
publish.bat
```

Never run `npm run db:seed` in production. It can wipe orders. Use `npm run db:setup-safe`.

## Production Deploy

See [DEPLOY.md](./DEPLOY.md) for hosting notes and env variables. The current VPS update script pulls `origin/main`, installs dependencies, syncs Prisma, builds, and restarts PM2.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | TypeScript typecheck |
| `npm run db:push` | Apply Prisma schema |
| `npm run db:seed` | Dev reset only; wipes data |
| `npm run db:setup-safe` | Upsert products without wiping orders |
| `scripts\localhost.bat` | Windows localhost setup and dev server |
| `scripts\prepare-deploy.bat` | Windows pre-deploy verification |
