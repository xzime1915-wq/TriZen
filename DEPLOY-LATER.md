# পরে upload / publish করলে — এই লিস্ট follow করুন

যখন agent-কে বলবেন **"upload করো"** বা **"publish করো"**, এই ফাইলটা মেনে চলুন।

---

## ✅ আগে যা হয়ে গেছে

- [x] Code GitHub-এ: https://github.com/xzime1915-wq/TriZen
- [x] `git push` সফল

---

## 📋 এখন যা বাকি (এক এক করে)

### ১. Database (Neon error হলে → Supabase)

**Supabase (সুপারিশ):** https://supabase.com  
→ New project → Settings → Database → **URI** connection string copy  

`.env`-এ:
```
DATABASE_URL="postgresql://..."
```

PC-তে একবার:
```bash
cd f:/trizenweb1/trizenweb
npx prisma db push
npm run db:setup-safe
```
(`.env`-এ `ADMIN_EMAIL` + `ADMIN_PASSWORD` থাকতে হবে)

---

### ২. Netlify deploy

https://app.netlify.com → **Import from Git** → `xzime1915-wq/TriZen`

**Build settings:**
| Field | Value |
|-------|--------|
| Build command | `npm run build:netlify` |
| Publish directory | *(খালি — `.next` দেবেন না)* |

---

### ৩. Environment Variables (Netlify)

| Key | কী দেবেন |
|-----|---------|
| `DATABASE_URL` | Supabase/Neon PostgreSQL link |
| `JWT_SECRET` | লম্বা random (৩২+ char) |
| `APP_URL` | `https://xxxx.netlify.app` |
| `NEXT_PUBLIC_APP_URL` | একই URL |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_BKASH_NUMBER` | bKash নম্বর |
| `NEXT_PUBLIC_NAGAD_NUMBER` | Nagad নম্বর |

`.env` ফাইল Netlify-এ upload করবেন না — শুধু key/value।

---

### ৪. Deploy পরে

1. Site URL খুলে test  
2. Admin: `/admin/login`  
3. Admin → Settings → bank details  

---

### ৫. Domain (পরে চাইলে)

Netlify → Domain management → আপনার domain connect  
→ `APP_URL` + `NEXT_PUBLIC_APP_URL` আপডেট → Redeploy  

---

## 🔗 দরকারি লিংক

- GitHub repo: https://github.com/xzime1915-wq/TriZen  
- বিস্তারিত: `NETLIFY-SETUP.md`  
- English deploy: `DEPLOY.md`  

---

*শেষ আপডেট: মে ২০২৬ — publish শুরু করতে বললে agent এই ফাইলটা খুলবে।*
