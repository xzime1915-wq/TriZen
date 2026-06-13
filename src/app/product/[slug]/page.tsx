import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getRelatedProducts } from "@/lib/related-products";
import {
  parseFeatures,
  parseSpecs,
  parseGallery,
  parseColors,
  averageRating,
  getTripadDescriptionSlides,
} from "@/lib/product-data";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { verifiedReviewSelect, verifiedReviewWhere } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, image: true },
  });
  if (!product) return { title: "Product" };

  const isGlass =
    slug.includes("tripad") || product.description.toLowerCase().includes("glass");
  const title = isGlass
    ? `${product.name}, Esports Glass Mouse Pad Bangladesh`
    : `${product.name}, Esports Gear Bangladesh`;
  const description = product.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/product/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/product/${slug}`,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: verifiedReviewWhere,
        orderBy: { createdAt: "desc" },
        select: verifiedReviewSelect,
      },
    },
  });
  if (!product) notFound();

  const features = parseFeatures(product.features);
  const specifications = parseSpecs(product.specifications);
  const gallery = parseGallery(product.galleryImages, product.image, {
    slug: product.slug,
    name: product.name,
  });
  const descriptionSlides = getTripadDescriptionSlides(product.slug, product.name);
  const colors = parseColors(product.colors);
  const avgRating = averageRating(product.reviews);
  const related = await getRelatedProducts(product.id, product.category);

  return (
    <div className="min-h-screen w-full bg-white">
      <ProductDetailView
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          longDescription: product.longDescription,
          price: product.price,
          compareAt: product.compareAt,
          image: product.image,
          category: product.category,
          stock: product.stock,
          sku: product.sku,
          tag: product.tag,
        }}
        features={features}
        specifications={specifications}
        gallery={gallery}
        descriptionSlides={descriptionSlides}
        colors={colors}
        avgRating={avgRating}
        reviews={product.reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
      <div className="product-page-pad pb-14 md:pb-16">
        <RelatedProducts products={related} category={product.category} />
      </div>
    </div>
  );
}
