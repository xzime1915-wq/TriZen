"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "./StarRating";
import { ProductFaqSection } from "./ProductFaqSection";
import { ProductReviewSection } from "./ProductReviewSection";
import { ProductGallery } from "./ProductGallery";
import { ProductColorPicker } from "./ProductColorPicker";
import { ProductSpecShowcase } from "./ProductSpecShowcase";
import { ProductDescriptionBlock } from "./ProductDescriptionBlock";
import { ProductReviewsBlock } from "./ProductReviewsBlock";
import { isUpcoming } from "@/lib/product-status";
import { ProductPrice } from "./ProductPrice";
import type { ProductColor, ProductSpec } from "@/lib/product-data";
import { getShopGearLine, SHOP_GEAR_COPY } from "@/lib/shop-gears";
import { discountPercent } from "@/lib/discount";

export type ProductReviewData = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verified?: boolean;
  createdAt: string;
};

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    price: number;
    compareAt: number | null;
    image: string;
    category: string;
    stock: number;
    sku: string | null;
    tag: string | null;
  };
  features: string[];
  specifications: ProductSpec[];
  gallery: string[];
  descriptionSlides: string[];
  colors: ProductColor[];
  reviews: ProductReviewData[];
  avgRating: number;
};

export function ProductDetailView({
  product,
  features,
  specifications,
  gallery,
  descriptionSlides,
  colors,
  reviews: initialReviews,
  avgRating: initialAvg,
}: Props) {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    colors[0] ?? null
  );
  const [reviews, setReviews] = useState(initialReviews);
  const [avgRating, setAvgRating] = useState(initialAvg);
  const upcoming = isUpcoming(product.tag);
  const gearLine = getShopGearLine(product.slug, product.name, product.category);
  const gearLabel = SHOP_GEAR_COPY[gearLine].title;
  const savePct = discountPercent(product.price, product.compareAt);

  const introParagraphs = (product.longDescription || product.description)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 3);

  const specFeatureImage =
    descriptionSlides[0] ?? gallery[1] ?? gallery[0] ?? product.image;

  function onReviewAdded(review: ProductReviewData) {
    const next = [review, ...reviews];
    setReviews(next);
    const sum = next.reduce((s, r) => s + r.rating, 0);
    setAvgRating(Math.round((sum / next.length) * 10) / 10);
  }

  return (
    <div className="w-full">
      <div className="product-page-pad py-6 md:py-10 lg:py-12">
        <nav className="product-buy-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?gear=${gearLine}`}>{gearLabel}</Link>
        </nav>

        <div className="product-split-grid product-split-grid--wide-visual">
          <div className="min-w-0 w-full">
            <ProductGallery images={gallery} productName={product.name} />
          </div>

          <div className="product-buy-panel min-w-0 w-full lg:sticky lg:top-[4.75rem] lg:max-w-[26rem] lg:justify-self-end xl:max-w-[30rem]">
            <h1 className="product-buy-title">{product.name}</h1>

            <div className="product-buy-price mt-2 sm:mt-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <ProductPrice
                  price={product.price}
                  compareAt={product.compareAt}
                  tag={product.tag}
                  className="product-buy-price-value"
                  compareClassName="product-buy-price-compare"
                />
                {savePct != null && (
                  <span className="text-[10px] font-light uppercase tracking-[0.14em] text-zinc-500">
                    Save {savePct}%
                  </span>
                )}
              </div>
            </div>

            {introParagraphs.length > 0 && (
              <div className="product-buy-copy trizen-prose mt-4 max-w-md space-y-4 sm:mt-6">
                {introParagraphs.map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
              </div>
            )}

            {reviews.length > 0 ? (
              <div className="mt-5 flex items-center gap-3 sm:mt-6">
                <StarRating value={avgRating} size="sm" />
                <a
                  href="#reviews"
                  className="text-xs font-normal text-black hover:underline"
                >
                  ({avgRating})
                </a>
              </div>
            ) : null}

            {selectedColor && colors.length > 0 && (
              <div className="mt-6">
                <ProductColorPicker
                  colors={colors}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                />
              </div>
            )}

            <div className="mt-6 sm:mt-8">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  compareAt: product.compareAt,
                  image: selectedColor?.image ?? product.image,
                  stock: product.stock,
                }}
                color={selectedColor?.name}
                colors={colors}
                sku={product.sku}
                comingSoon={upcoming}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductSpecShowcase
        productName={product.name}
        specifications={specifications}
        featureImage={specFeatureImage}
      />

      <ProductDescriptionBlock
        productName={product.name}
        description={product.longDescription || product.description}
        descriptionSlides={descriptionSlides}
        features={features}
      />

      <ProductReviewsBlock>
        <ProductReviewSection
          slug={product.slug}
          reviews={reviews}
          onReviewAdded={onReviewAdded}
        />
      </ProductReviewsBlock>

      <ProductFaqSection
        productName={product.name}
        slug={product.slug}
        category={product.category}
        tag={product.tag}
      />
    </div>
  );
}
