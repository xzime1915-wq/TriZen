/**
 * Copy data from prisma/dev.db (SQLite) → PostgreSQL (DATABASE_URL in .env).
 *
 * 1. Set DATABASE_URL=postgresql://... in .env
 * 2. npx prisma db push
 * 3. npm run db:migrate-sqlite
 */
import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const SQLITE_PATH = path.join(process.cwd(), "prisma", "dev.db");
const prisma = new PrismaClient();

function rows<T>(table: string): T[] {
  const db = new Database(SQLITE_PATH, { readonly: true });
  try {
    return db.prepare(`SELECT * FROM ${table}`).all() as T[];
  } finally {
    db.close();
  }
}

async function main() {
  if (!process.env.DATABASE_URL?.startsWith("postgres")) {
    console.error("Set DATABASE_URL to a postgresql:// URL in .env first.");
    process.exit(1);
  }

  console.log("Reading SQLite:", SQLITE_PATH);

  const products = rows<Record<string, unknown>>("Product");
  const users = rows<Record<string, unknown>>("User");
  const admins = rows<Record<string, unknown>>("Admin");
  const customers = rows<Record<string, unknown>>("Customer");
  const orders = rows<Record<string, unknown>>("Order");
  const orderItems = rows<Record<string, unknown>>("OrderItem");
  const reviews = rows<Record<string, unknown>>("ProductReview");
  const settings = rows<Record<string, unknown>>("StoreSettings");

  console.log("Writing to PostgreSQL...");

  for (const s of settings) {
    await prisma.storeSettings.upsert({
      where: { id: Number(s.id) },
      create: s as never,
      update: s as never,
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: String(p.id) },
      create: p as never,
      update: p as never,
    });
  }

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: String(u.id) },
      create: u as never,
      update: u as never,
    });
  }

  for (const a of admins) {
    await prisma.admin.upsert({
      where: { id: String(a.id) },
      create: a as never,
      update: a as never,
    });
  }

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { id: String(c.id) },
      create: c as never,
      update: c as never,
    });
  }

  for (const o of orders) {
    await prisma.order.upsert({
      where: { id: String(o.id) },
      create: o as never,
      update: o as never,
    });
  }

  for (const i of orderItems) {
    await prisma.orderItem.upsert({
      where: { id: String(i.id) },
      create: i as never,
      update: i as never,
    });
  }

  for (const r of reviews) {
    await prisma.productReview.upsert({
      where: { id: String(r.id) },
      create: r as never,
      update: r as never,
    });
  }

  console.log("Done:", {
    products: products.length,
    orders: orders.length,
    customers: customers.length,
    reviews: reviews.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
