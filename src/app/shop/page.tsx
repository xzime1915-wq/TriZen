import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopMarquee } from "@/components/shop/ShopMarquee";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopGearSection } from "@/components/shop/ShopGearSection";
import { ShopEmpty } from "@/components/shop/ShopEmpty";
import { HomeCta } from "@/components/home/HomeCta";
import {
  getShopGearLine,
  SHOP_GEAR_COPY,
  SHOP_GEAR_ORDER,
  isShopGearLine,
  type ShopGearLine,
} from "@/lib/shop-gears";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; gear?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeGear = isShopGearLine(params.gear) ? params.gear : undefined;

  const products = await prisma.product.findMany({
    where: {
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

  const grouped = SHOP_GEAR_ORDER.reduce(
    (acc, gear) => {
      acc[gear] = [];
      return acc;
    },
    {} as Record<ShopGearLine, typeof products>
  );

  for (const p of products) {
    const gear = getShopGearLine(p.slug, p.name, p.category);
    grouped[gear].push(p);
  }

  const sectionsToShow = activeGear ? [activeGear] : SHOP_GEAR_ORDER;
  const productCount = sectionsToShow.reduce(
    (n, gear) => n + grouped[gear].length,
    0
  );
  const showAllGearSections = !activeGear && !params.q;

  return (
    <div className="bg-black min-h-screen">
      <ShopHero
        count={productCount}
        activeGearLabel={activeGear ? SHOP_GEAR_COPY[activeGear].title : undefined}
        query={params.q}
      />
      <ShopMarquee />

      <Suspense fallback={<div className="h-[72px] border-b border-[var(--color-border)]" />}>
        <ShopFilters />
      </Suspense>

      <div className="container-trizen pb-0">
        {productCount === 0 && !showAllGearSections ? (
          <section className="py-16 md:py-24">
            <ShopEmpty />
          </section>
        ) : (
          sectionsToShow.map((gear) => (
            <ShopGearSection
              key={gear}
              gear={gear}
              showWhenEmpty={showAllGearSections}
              products={grouped[gear].map((p) => ({
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
