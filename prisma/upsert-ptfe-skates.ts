import { PrismaClient } from "@prisma/client";
import { buildPtfeMouseSkatesProductData } from "../src/lib/product-catalog-content";
import { isUpcoming } from "../src/lib/product-status";

const prisma = new PrismaClient();

async function main() {
  const data = buildPtfeMouseSkatesProductData();
  const existing = await prisma.product.findUnique({
    where: { slug: data.slug },
    select: { id: true, tag: true, stock: true, price: true },
  });

  // Content-only fields. Never touch tag / stock / price after the product exists —
  // vps-update.sh runs this on every deploy and used to reset Upcoming over admin edits.
  const content = {
    name: data.name,
    description: data.description,
    longDescription: data.longDescription,
    features: data.features,
    specifications: data.specifications,
    galleryImages: data.galleryImages,
    colors: data.colors,
    sku: data.sku,
    barcode: data.barcode,
    image: data.image,
    category: data.category,
    featured: data.featured,
  };

  if (!existing) {
    await prisma.product.create({
      data: {
        ...data,
        ...content,
        tag: null,
        price: 0,
        compareAt: null,
        stock: 0,
      },
    });
    console.log(`Created: ${data.slug} (inventory left for admin)`);
    return;
  }

  await prisma.product.update({
    where: { slug: data.slug },
    data: content,
  });

  // Heal: if admin already stocked it, strip a leftover Upcoming tag.
  if (existing.stock > 0 && isUpcoming(existing.tag)) {
    await prisma.product.update({
      where: { slug: data.slug },
      data: { tag: null },
    });
    console.log(
      `Updated: ${data.slug} (cleared Upcoming tag — stock=${existing.stock}, price=${existing.price})`,
    );
    return;
  }

  console.log(
    `Updated: ${data.slug} (kept tag=${JSON.stringify(existing.tag)}, stock=${existing.stock}, price=${existing.price})`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
