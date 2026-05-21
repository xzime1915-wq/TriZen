/**
 * Safe production setup — upserts catalog + V2 without wiping orders.
 * Usage: npx tsx prisma/seed-safe.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  buildTripadProductData,
  buildTripadV2ProductData,
} from "../src/lib/product-catalog-content";

const prisma = new PrismaClient();

const catalog = [
  { ...buildTripadProductData("black"), price: 6100, compareAt: null, stock: 50 },
  { ...buildTripadProductData("white"), price: 6100, compareAt: null, stock: 40 },
  { ...buildTripadV2ProductData("black"), price: 0, compareAt: null, stock: 0 },
  { ...buildTripadV2ProductData("white"), price: 0, compareAt: null, stock: 0 },
];

async function main() {
  for (const data of catalog) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      create: data,
      update: {
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        features: data.features,
        specifications: data.specifications,
        galleryImages: data.galleryImages,
        colors: data.colors,
        sku: data.sku,
        tag: data.tag,
        image: data.image,
        category: data.category,
        featured: data.featured,
      },
    });
  }

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      tagline: "Premium Esports Gear",
      currency: "BDT",
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "admin@trizenstore.com";
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin && process.env.ADMIN_PASSWORD?.trim()) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD.trim(), 12);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        name: "TriZen Admin",
      },
    });
    console.log(`Admin created: ${adminEmail}`);
  } else if (!existingAdmin) {
    console.log("No admin yet — set ADMIN_PASSWORD and run again, or create via db:seed (dev only).");
  }

  console.log("Safe seed complete (products upserted, orders untouched).");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
