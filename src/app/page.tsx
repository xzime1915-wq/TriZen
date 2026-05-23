import { prisma } from "@/lib/prisma";
import { HomeMinimalHero } from "@/components/home/HomeMinimalHero";
import { HomeMarquee } from "@/components/home/HomeMarquee";
import { HomeStatement } from "@/components/home/HomeStatement";
import { HomeGlideFeature } from "@/components/home/HomeGlideFeature";
import { HomeProductShowcase } from "@/components/home/HomeProductShowcase";
import { HomeFeaturesGrid } from "@/components/home/HomeFeaturesGrid";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeReviews } from "@/components/home/HomeReviews";
import { HomeCta } from "@/components/home/HomeCta";
import { HOME_HERO_IMAGE } from "@/lib/home-assets";
import { parseFeatures, averageRating } from "@/lib/product-data";

export const dynamic = "force-dynamic";

const HERO_SLUG = "trizen-tripad-v1-black";

/** Already shown in HomeGlideFeature — skip duplicate showcases on home */
const GLIDE_SECTION_SLUGS = new Set([
  "trizen-tripad-v1-black",
  "trizen-tripad-v1-white",
  "trizen-tripad-v2-black",
  "trizen-tripad-v2-white",
]);

function stripEditionSuffix(name: string) {
  return name.replace(/\s+(Black|White)$/i, "");
}

export default async function HomePage() {
  const [products, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { name: "asc" },
      take: 8,
      include: {
        reviews: { select: { rating: true } },
      },
    }),
    prisma.productReview.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    }),
  ]);

  const heroProduct =
    products.find((p) => p.slug === HERO_SLUG) ||
    products.find((p) => p.name.toLowerCase().includes("black")) ||
    products[0];

  return (
    <>
      <HomeMinimalHero productSlug={heroProduct?.slug ?? HERO_SLUG} />

      <HomeMarquee />
      <HomeStatement />
      <HomeGlideFeature />

      {products
        .filter((p) => !GLIDE_SECTION_SLUGS.has(p.slug))
        .map((p, index) => {
        const usesDuoVisual = p.slug === HERO_SLUG;

        return (
          <HomeProductShowcase
            key={p.id}
            reverse={index % 2 === 1}
            displayName={usesDuoVisual ? stripEditionSuffix(p.name) : undefined}
            product={{
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description,
              longDescription: p.longDescription,
              price: p.price,
              compareAt: p.compareAt,
              image: p.image,
              stock: p.stock,
              sku: p.sku,
              tag: p.tag,
            }}
            features={parseFeatures(p.features)}
            avgRating={averageRating(p.reviews)}
            reviewCount={p.reviews.length}
            visualImage={usesDuoVisual ? HOME_HERO_IMAGE : undefined}
          />
        );
      })}

      <HomeFeaturesGrid />
      <HomeProcess />
      <HomeReviews
        reviews={reviews.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          rating: r.rating,
          title: r.title,
          body: r.body,
          productName: r.product.name,
        }))}
      />
      <HomeCta />
    </>
  );
}
