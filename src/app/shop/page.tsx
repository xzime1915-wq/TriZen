import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopMarquee } from "@/components/shop/ShopMarquee";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopEditionSection } from "@/components/shop/ShopEditionSection";
import { ShopEmpty } from "@/components/shop/ShopEmpty";
import { HomeCta } from "@/components/home/HomeCta";
import {
  getShopEdition,
  SHOP_EDITION_ORDER,
  type ShopEdition,
} from "@/lib/shop-editions";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const categoryList = categories.map((c) => c.category);

  const products = await prisma.product.findMany({
    where: {
      ...(params.category ? { category: params.category } : {}),
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { description: { contains: params.q } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  const grouped = SHOP_EDITION_ORDER.reduce(
    (acc, edition) => {
      acc[edition] = [];
      return acc;
    },
    {} as Record<ShopEdition, typeof products>
  );

  for (const p of products) {
    const edition = getShopEdition(p.slug, p.name);
    grouped[edition].push(p);
  }

  return (
    <div className="bg-black min-h-screen">
      <ShopHero
        count={products.length}
        activeCategory={params.category}
        query={params.q}
      />
      <ShopMarquee />

      <Suspense fallback={<div className="h-[72px] border-b border-[var(--color-border)]" />}>
        <ShopFilters categories={categoryList} />
      </Suspense>

      <div className="container-trizen pb-0">
        {products.length === 0 ? (
          <section className="py-16 md:py-24">
            <ShopEmpty />
          </section>
        ) : (
          SHOP_EDITION_ORDER.map((edition) => (
            <ShopEditionSection
              key={edition}
              edition={edition}
              products={grouped[edition].map((p) => ({
                name: p.name,
                slug: p.slug,
                description: p.description,
                longDescription: p.longDescription,
                price: p.price,
                compareAt: p.compareAt,
                image: p.image,
                category: p.category,
                stock: p.stock,
                tag: p.tag,
              }))}
            />
          ))
        )}
      </div>

      <HomeCta />
    </div>
  );
}
