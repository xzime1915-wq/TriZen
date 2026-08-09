/**
 * Safe production setup — upserts catalog + V2 without wiping orders.
 * Usage: npx tsx prisma/seed-safe.ts
 *
 * Inventory fields (tag / stock / price / compareAt) are admin-owned after create.
 * Never rewrite them on update — deploy scripts were resetting PTFE to Upcoming.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  buildPtfeMouseSkatesProductData,
  buildTripadProductData,
  buildTripadV2ProductData,
} from "../src/lib/product-catalog-content";
import { isUpcoming } from "../src/lib/product-status";

const prisma = new PrismaClient();

const catalog = [
  { ...buildTripadProductData("black"), price: 6100, compareAt: null, stock: 50 },
  { ...buildTripadProductData("white"), price: 6100, compareAt: null, stock: 40 },
  { ...buildTripadV2ProductData("black"), price: 0, compareAt: null, stock: 0 },
  { ...buildTripadV2ProductData("white"), price: 0, compareAt: null, stock: 0 },
  { ...buildPtfeMouseSkatesProductData(), price: 0, compareAt: null, stock: 0 },
];

const PERMANENT_ORDER_BLOG_ADMIN_EMAIL = "trizenstore@gmail.com";

async function main() {
  for (const data of catalog) {
    const { tag: _tag, price: _price, stock: _stock, compareAt: _compareAt, ...content } =
      data as typeof data & {
        tag?: string | null;
        price?: number;
        stock?: number;
        compareAt?: number | null;
      };

    await prisma.product.upsert({
      where: { slug: data.slug },
      create: data,
      update: {
        name: content.name,
        description: content.description,
        longDescription: content.longDescription,
        features: content.features,
        specifications: content.specifications,
        galleryImages: content.galleryImages,
        colors: content.colors,
        sku: content.sku,
        barcode: content.barcode,
        image: content.image,
        category: content.category,
        featured: content.featured,
      },
    });
  }

  // If PTFE was launched in admin (stock > 0), strip any leftover Upcoming tag.
  const ptfe = await prisma.product.findUnique({
    where: { slug: "trizen-ptfe-mouse-skates" },
    select: { tag: true, stock: true },
  });
  if (ptfe && ptfe.stock > 0 && isUpcoming(ptfe.tag)) {
    await prisma.product.update({
      where: { slug: "trizen-ptfe-mouse-skates" },
      data: { tag: null },
    });
    console.log("Cleared Upcoming tag on trizen-ptfe-mouse-skates (in stock).");
  }

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      storeName: "TRIZEN STORE",
    },
    create: {
      id: 1,
      storeName: "TRIZEN STORE",
      tagline: "Premium Esports Gear",
      currency: "BDT",
    },
  });

  const adminEmail = (
    process.env.ADMIN_EMAIL?.trim() || "admin@trizenstore.com"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (adminPassword) {
    const hash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        passwordHash: hash,
        name: "TriZen Admin",
        role: "owner",
        expiresAt: null,
      },
      update: { passwordHash: hash, role: "owner", expiresAt: null },
    });
    console.log(`Admin ready: ${adminEmail}`);
  } else {
    console.log("Set ADMIN_EMAIL + ADMIN_PASSWORD in .env, then run again.");
  }

  const blogAdmin = await prisma.admin.findUnique({
    where: { email: PERMANENT_ORDER_BLOG_ADMIN_EMAIL },
  });
  if (blogAdmin) {
    await prisma.admin.update({
      where: { email: PERMANENT_ORDER_BLOG_ADMIN_EMAIL },
      data: { role: "order_blog_manager", expiresAt: null },
    });
    console.log(
      `Permanent order + blog access ready: ${PERMANENT_ORDER_BLOG_ADMIN_EMAIL}`
    );
  } else {
    console.log(
      `Admin not found for permanent blog access: ${PERMANENT_ORDER_BLOG_ADMIN_EMAIL}`
    );
  }

  console.log("Safe seed complete (products upserted, orders untouched).");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
