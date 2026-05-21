# Netlify-তে TriZen Store deploy (বাংলা গাইড)

Netlify-এ **SQLite কাজ করে না** — তাই **Neon (PostgreSQL)** লাগবে। নিচের ধাপগুলো follow করুন।

---

## ১. Neon database (ফ্রি)

1. যান: https://neon.tech → Sign up
2. **New Project** → Connection string কপি করুন  
   উদাহরণ: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

---

## ২. Netlify Environment Variables

Netlify → Site → **Site configuration** → **Environment variables** → Add:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon-এর PostgreSQL connection string |
| `JWT_SECRET` | `openssl rand -hex 32` দিয়ে বানানো random string |
| `APP_URL` | `https://luminous-seahorse-fc1507.netlify.app` (আপনার Netlify URL) |
| `NEXT_PUBLIC_APP_URL` | একই URL |
| `ADMIN_EMAIL` | আপনার admin email |
| `ADMIN_PASSWORD` | শক্ত পাসওয়ার্ড |
| `NEXT_PUBLIC_BKASH_NUMBER` | bKash নম্বর |
| `NEXT_PUBLIC_NAGAD_NUMBER` | Nagad নম্বর |
| `NODE_ENV` | `production` |

Google login চাইলে `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` যোগ করুন।

---

## ৩. GitHub push

```bash
git add .
git commit -m "Netlify + PostgreSQL setup"
git push
```

Netlify আবার deploy করবে automatically।

---

## ৪. প্রথম deploy-এর পরে database setup

Netlify deploy একবার **সফল** হলে, local থেকে Neon DB-তে data দিন:

`.env`-এ Neon `DATABASE_URL` বসিয়ে:

```bash
npm install
npx prisma db push
npm run db:setup-safe
```

অথবা Netlify **Functions** shell না থাকলে local থেকেই একই `DATABASE_URL` দিয়ে `db:setup-safe` চালান — সেটাই production DB।

---

## ৫. Google OAuth (optional)

Google Cloud Console → OAuth client → Authorized redirect URI:

```
https://YOUR-SITE.netlify.app/api/auth/google/callback
```

---

## ৬. Admin login

`https://YOUR-SITE.netlify.app/admin/login`

`.env`-এ যে `ADMIN_EMAIL` / `ADMIN_PASSWORD` দিয়েছেন সেটা দিয়ে login।

---

## সমস্যা হলে

| Error | সমাধান |
|-------|--------|
| Application error | Netlify → **Deploy log** দেখুন; `JWT_SECRET` ও `DATABASE_URL` আছে কিনা |
| SQLite / file: | `DATABASE_URL` অবশ্যই `postgresql://...` হতে হবে |
| Empty shop | `npm run db:setup-safe` চালান (Neon URL দিয়ে) |

---

## Railway বিকল্প

SQLite রেখে সহজ deploy চাইলে **Railway** ব্যবহার করুন — `DEPLOY.md` দেখুন।
