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
} from "@/lib/product-data";

export const dynamic = "force-dynamic";

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
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          authorName: true,
          rating: true,
          title: true,
          body: true,
          createdAt: true,
        },
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
  const colors = parseColors(product.colors);
  const avgRating = averageRating(product.reviews);
  const related = await getRelatedProducts(product.id, product.category);

  return (
    <div className="bg-black min-h-screen border-t border-[var(--color-border)]">
      <div className="container-trizen py-10 md:py-14">
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
        colors={colors}
        avgRating={avgRating}
        reviews={product.reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
      <RelatedProducts products={related} category={product.category} />
      </div>
    </div>
  );
}
