import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { JsonLd } from "@/components/seo/JsonLd";
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
import { SEO_MOUSE_PAD_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { getTripadCatalogBySlug } from "@/lib/product-catalog-content";
import { isUpcoming } from "@/lib/product-status";
import { verifiedReviewSelect, verifiedReviewWhere } from "@/lib/reviews";

export const dynamic = "force-dynamic";

type ProductJsonLdInput = {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  tag: string | null;
  reviews: { rating: number }[];
};

function absoluteUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function buildProductJsonLd({
  product,
  gallery,
  avgRating,
}: {
  product: ProductJsonLdInput;
  gallery: string[];
  avgRating: number;
}): Record<string, unknown> {
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const images = (gallery.length > 0 ? gallery : [product.image])
    .filter(Boolean)
    .map(absoluteUrl);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: cleanText(product.longDescription || product.description),
    image: images,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "TRIZEN",
    },
    category: product.category,
    url: productUrl,
    mainEntityOfPage: productUrl,
  };

  if (avgRating > 0 && product.reviews.length > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (!isUpcoming(product.tag) && product.price > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      "@id": `${productUrl}#offer`,
      url: productUrl,
      priceCurrency: "BDT",
      price: Number(product.price.toFixed(2)),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#store` },
    };
  }

  return jsonLd;
}

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

  const catalog = getTripadCatalogBySlug(slug);
  const displayName = catalog?.name ?? product.name;
  const displayDescription = catalog?.description ?? product.description;

  const isGlass =
    slug.includes("tripad") || displayDescription.toLowerCase().includes("glass");
  const title = isGlass
    ? `${displayName} Glass Mouse Pad Price in Bangladesh`
    : `${displayName} Price in Bangladesh`;
  const description = cleanText(
    isGlass
      ? `${displayName} is a large TRIPAD glass mouse pad for esports, FPS, Valorant and CS2. Buy in Bangladesh from TRIZEN Store with COD delivery.`
      : `${displayName} from TRIZEN Store, esports gear for competitive players in Bangladesh. Check price, details and delivery options online.`,
  ).slice(0, 160);
  const keywords = isGlass
    ? [
        displayName,
        "glass mouse pad price in Bangladesh",
        "gaming mouse pad price in Bangladesh",
        "large mouse pad Bangladesh",
        "TRIPAD glass mouse pad",
        ...SEO_MOUSE_PAD_KEYWORDS,
      ]
    : [displayName, "esports gear Bangladesh", ...SEO_MOUSE_PAD_KEYWORDS];

  return {
    title,
    description,
    keywords: Array.from(new Set(keywords)),
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

  const catalog = getTripadCatalogBySlug(slug);
  const description = catalog?.description ?? product.description;
  const longDescription = catalog?.longDescription ?? product.longDescription;

  const features = parseFeatures(catalog?.features ?? product.features);
  const specifications = parseSpecs(product.specifications);
  const gallery = parseGallery(product.galleryImages, product.image, {
    slug: product.slug,
    name: product.name,
  });
  const descriptionSlides = getTripadDescriptionSlides(product.slug, product.name);
  const colors = parseColors(product.colors);
  const avgRating = averageRating(product.reviews);
  const related = await getRelatedProducts(product.id, product.category);
  const productJsonLd = buildProductJsonLd({
    product: {
      name: catalog?.name ?? product.name,
      slug: product.slug,
      description,
      longDescription,
      image: product.image,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      tag: product.tag,
      reviews: product.reviews,
    },
    gallery,
    avgRating,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <JsonLd data={productJsonLd} />
      <ProductDetailView
        product={{
          id: product.id,
          name: catalog?.name ?? product.name,
          slug: product.slug,
          description,
          longDescription,
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
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
