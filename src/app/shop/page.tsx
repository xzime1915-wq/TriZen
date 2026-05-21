import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopMarquee } from "@/components/shop/ShopMarquee";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopEmpty } from "@/components/shop/ShopEmpty";
import { HomeCta } from "@/components/home/HomeCta";

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

      <section className="container-trizen py-12 md:py-16 lg:py-20 pb-0">
        {products.length === 0 ? (
          <ShopEmpty />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10 xl:gap-12">
            {products.map((p) => (
              <ShopProductCard
                key={p.id}
                product={{
                  name: p.name,
                  slug: p.slug,
                  description: p.description,
                  price: p.price,
                  compareAt: p.compareAt,
                  image: p.image,
                  category: p.category,
                  stock: p.stock,
                  tag: p.tag,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <HomeCta />
    </div>
  );
}
