import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  buildPtfeMouseSkatesProductData,
  buildTripadProductData,
  buildTripadV2ProductData,
} from "../src/lib/product-catalog-content";

const prisma = new PrismaClient();

const products = [
  { ...buildTripadProductData("black"), price: 6100, compareAt: null, stock: 50 },
  { ...buildTripadProductData("white"), price: 6100, compareAt: null, stock: 40 },
  { ...buildTripadV2ProductData("black"), price: 0, compareAt: null, stock: 0 },
  { ...buildTripadV2ProductData("white"), price: 0, compareAt: null, stock: 0 },
  { ...buildPtfeMouseSkatesProductData(), price: 0, compareAt: null, stock: 0 },
];

async function main() {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DESTRUCTIVE_SEED) {
    throw new Error(
      "Refusing destructive seed in production. Set ALLOW_DESTRUCTIVE_SEED=1 only if you mean to wipe data."
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error("Set ADMIN_PASSWORD (min 8 characters) before running db:seed.");
  }

  await prisma.productReview.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      tagline: "Premium Esports Gear",
      currency: "BDT",
    },
    create: {
      tagline: "Premium Esports Gear",
      currency: "BDT",
    },
  });

  const hash = await bcrypt.hash(adminPassword, 12);
  await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL?.trim() || "admin@trizenstore.com",
      passwordHash: hash,
      name: "TriZen Admin",
      role: "owner",
      expiresAt: null,
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
