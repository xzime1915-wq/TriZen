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
import { HomeBlog } from "@/components/home/HomeBlog";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFaqJsonLd } from "@/components/seo/HomeFaqJsonLd";
import { parseFeatures, averageRating } from "@/lib/product-data";
import { homePageMetadata } from "@/lib/seo-metadata";

export const revalidate = 60;

export const metadata = homePageMetadata();

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

  // Resilient: never crash the homepage if the blog table is not migrated yet.
  const blogPosts = await prisma.blogPost
    .findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    })
    .catch(() => []);

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
          priority={index === 0}
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
      <HomeBlog
        posts={blogPosts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage,
          category: p.category,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
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
