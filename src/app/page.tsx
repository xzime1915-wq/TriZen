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
import { HomeOurGears } from "@/components/home/HomeOurGears";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFaqJsonLd } from "@/components/seo/HomeFaqJsonLd";
import { parseFeatures, averageRating } from "@/lib/product-data";

export const dynamic = "force-dynamic";

const HERO_SLUG = "trizen-tripad-v1-black";

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

      <HomeOurGears />

      {products.map((p, index) => (
        <HomeProductShowcase
          key={p.id}
          reverse={index % 2 === 1}
          displayName={
            p.slug === HERO_SLUG ? stripEditionSuffix(p.name) : undefined
          }
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
        />
      ))}

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
      <HomeFaqJsonLd />
      <HomeFaqSection />
      <HomeCta />
    </>
  );
}
