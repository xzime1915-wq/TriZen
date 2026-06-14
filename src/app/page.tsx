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
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
import { HomeFaqJsonLd } from "@/components/seo/HomeFaqJsonLd";
import { parseFeatures, averageRating } from "@/lib/product-data";
import { homePageMetadata } from "@/lib/seo-metadata";
import { verifiedReviewWhere } from "@/lib/reviews";
import {
  HOME_HERO_IMAGE,
  HOME_HERO_IMAGE_SIZES,
  HOME_HERO_IMAGE_SRC_SET,
} from "@/lib/home-assets";

export const revalidate = 60;

export const metadata = homePageMetadata();

const HERO_SLUG = "trizen-tripad-v1-black";

export default async function HomePage() {
  const [products, reviews, reviewStats] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { name: "asc" },
      take: 8,
      include: {
        reviews: {
          where: verifiedReviewWhere,
          select: { rating: true },
        },
      },
    }),
    prisma.productReview.findMany({
      where: verifiedReviewWhere,
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, image: true, slug: true } },
      },
    }),
    prisma.productReview.aggregate({
      where: verifiedReviewWhere,
      _count: true,
      _avg: { rating: true },
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
      <link
        rel="preload"
        as="image"
        href={HOME_HERO_IMAGE}
        imageSrcSet={HOME_HERO_IMAGE_SRC_SET}
        imageSizes={HOME_HERO_IMAGE_SIZES}
        fetchPriority="high"
      />
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
      <HomeFaqJsonLd />
      <HomeFaqSection />
      <HomeNewsletter />
      <HomeCta
        averageRating={reviewStats._avg.rating ?? 0}
        totalReviews={reviewStats._count}
      />
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
          verified: r.verified,
          productName: r.product.name,
          productSlug: r.product.slug,
          productImage: r.product.image,
          createdAt: r.createdAt.toISOString(),
        }))}
        averageRating={reviewStats._avg.rating ?? 0}
        totalReviews={reviewStats._count}
      />
    </>
  );
}
