"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "./StarRating";
import { ProductTabs } from "./ProductTabs";
import { ProductFaqSection } from "./ProductFaqSection";
import { ProductReviewSection } from "./ProductReviewSection";
import { ProductFeaturesList } from "./ProductFeaturesList";
import { ProductGallery } from "./ProductGallery";
import { ProductColorPicker } from "./ProductColorPicker";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { isUpcoming } from "@/lib/product-status";
import { ProductPrice } from "./ProductPrice";
import { ProductPurchaseInfo } from "./ProductPurchaseInfo";
import type { ProductColor, ProductSpec } from "@/lib/product-data";
import { getShopGearLine, SHOP_GEAR_COPY } from "@/lib/shop-gears";

export type ProductReviewData = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
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

  function onReviewAdded(review: ProductReviewData) {
    const next = [review, ...reviews];
    setReviews(next);
    const sum = next.reduce((s, r) => s + r.rating, 0);
    setAvgRating(Math.round((sum / next.length) * 10) / 10);
  }

  return (
    <div className="w-full">
      <div className="product-page-pad py-6 md:py-14">
      <nav className="mb-4 text-[0.65rem] text-[var(--color-muted)] md:mb-8 md:text-sm">
        <Link href="/" className="hover:text-[var(--color-foreground)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-[var(--color-foreground)]">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?gear=${gearLine}`} className="hover:text-[var(--color-foreground)]">
          {gearLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-foreground)]">{product.name}</span>
      </nav>

      <div className="product-split-grid product-split-grid--wide-visual">
        <div className="min-w-0 w-full">
          <ProductGallery images={gallery} productName={product.name} />
        </div>

        <div className="min-w-0 w-full lg:sticky lg:top-[4.5rem] lg:max-w-md lg:justify-self-end xl:max-w-lg">
          <div className="border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-sm md:p-6">
            {product.tag && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-white px-2.5 py-1 mb-3">
                {product.tag}
              </span>
            )}
            <h1 className="mb-2 text-[1.15rem] font-bold leading-tight md:mb-3 sm:text-3xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StarRating value={avgRating} />
              <span className="text-sm text-[var(--color-muted)]">
                {reviews.length > 0 ? (
                  <a
                    href="#reviews"
                    className="hover:text-[var(--color-foreground)] hover:underline"
                  >
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </a>
                ) : (
                  <span id="reviews">(No reviews yet)</span>
                )}
              </span>
            </div>

            <div className="mb-4">
              <StockBadge
                inStock={isInStock(product.stock)}
                upcoming={upcoming}
                size="md"
              />
            </div>

            <div className="mb-5 rounded-sm border border-emerald-200/80 bg-emerald-50/50 px-4 py-3">
              <ProductPrice
                price={product.price}
                compareAt={product.compareAt}
                tag={product.tag}
                className="text-[1.15rem] font-semibold text-emerald-700 md:text-2xl"
                compareClassName="text-sm text-[var(--color-muted)] line-through md:text-base"
              />
              {!upcoming && isInStock(product.stock) && (
                <p className="mt-1.5 text-[11px] text-emerald-800/80 normal-case">
                  + ৳120 delivery · COD available
                </p>
              )}
            </div>

            <p className="trizen-detail mb-5 normal-case">
              {product.description}
            </p>

            {features.length > 0 && (
              <div className="mb-5 pb-5 border-b border-[var(--color-border)]">
                <ProductFeaturesList
                  features={features.slice(0, 4)}
                  title="Highlights"
                />
              </div>
            )}

            {selectedColor && colors.length > 0 && (
              <div className="mb-5">
                <ProductColorPicker
                  colors={colors}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                />
              </div>
            )}

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                compareAt: product.compareAt,
                image: selectedColor?.image ?? product.image,
                stock: product.stock,
              }}
              color={selectedColor?.name}
              colors={colors}
              comingSoon={upcoming}
            />

            <ProductPurchaseInfo
              specifications={specifications}
              sku={product.sku}
              category={product.category}
              slug={product.slug}
              name={product.name}
              stock={product.stock}
              upcoming={upcoming}
            />
          </div>
        </div>
      </div>
      </div>

      <div className="trizen-full-bleed mt-14">
        <ProductTabs
          productName={product.name}
          description={product.longDescription || product.description}
          descriptionSlides={descriptionSlides}
          features={features}
          specifications={specifications}
          reviewsCount={reviews.length}
          reviewsPanel={
            <ProductReviewSection
              slug={product.slug}
              reviews={reviews}
              onReviewAdded={onReviewAdded}
            />
          }
        />
      </div>

      <ProductFaqSection productName={product.name} tag={product.tag} />
    </div>
  );
}
