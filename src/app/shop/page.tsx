import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopGearSection } from "@/components/shop/ShopGearSection";
import { ShopEditionShowcase } from "@/components/shop/ShopEditionShowcase";
import { ShopEmpty } from "@/components/shop/ShopEmpty";
import { HomeCta } from "@/components/home/HomeCta";
import { AllProductsFaqSection } from "@/components/faq/AllProductsFaqSection";
import {
  getShopGearLine,
  SHOP_GEAR_COPY,
  SHOP_GEAR_ORDER,
  isShopGearLine,
  type ShopGearLine,
} from "@/lib/shop-gears";
import type { Metadata } from "next";
import {
  esportsMousePadShopMetadata,
  glassMousePadShopMetadata,
} from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; gear?: string; q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  if (params.gear === "glass-mouse-pad") {
    return glassMousePadShopMetadata();
  }

  if (params.q) {
    return {
      title: `Search: ${params.q}`,
      robots: { index: false, follow: true },
    };
  }

  return esportsMousePadShopMetadata();
}

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

  const showEditionShowcase =
    !params.q && (!activeGear || activeGear === "glass-mouse-pad");

  const gearsToRender = showEditionShowcase
    ? sectionsToShow.filter((gear) => gear !== "glass-mouse-pad")
    : sectionsToShow;

  return (
    <div className="min-h-screen bg-white">
      <ShopHero
        count={productCount}
        activeGearLabel={activeGear ? SHOP_GEAR_COPY[activeGear].title : undefined}
        query={params.q}
      />

      <Suspense fallback={<div className="h-[72px]" />}>
        <ShopFilters />
      </Suspense>

      {showEditionShowcase ? <ShopEditionShowcase /> : null}

      {productCount === 0 && !showAllGearSections ? (
        <section className="container-trizen-full py-16 md:py-24">
          <ShopEmpty />
        </section>
      ) : (
        gearsToRender.map((gear, index) => (
          <ShopGearSection
            key={gear}
            gear={gear}
            index={index}
            showWhenEmpty={showAllGearSections}
            products={grouped[gear].map((p) => ({
              id: p.id,
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

      <AllProductsFaqSection />

      <HomeCta />
    </div>
  );
}
