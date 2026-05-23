"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "./StarRating";
import { ProductTabs } from "./ProductTabs";
import { ProductReviewSection } from "./ProductReviewSection";
import { ProductFeaturesList } from "./ProductFeaturesList";
import { ProductGallery } from "./ProductGallery";
import { ProductColorPicker } from "./ProductColorPicker";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { isUpcoming } from "@/lib/product-status";
import { ProductPrice } from "./ProductPrice";
import { usesTripadGlideBackground } from "@/lib/product-visuals";
import type { ProductColor, ProductSpec } from "@/lib/product-data";

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

  function onReviewAdded(review: ProductReviewData) {
    const next = [review, ...reviews];
    setReviews(next);
    const sum = next.reduce((s, r) => s + r.rating, 0);
    setAvgRating(Math.round((sum / next.length) * 10) / 10);
  }

  return (
    <div className="w-full">
      <div className="product-page-pad py-10 md:py-14">
      <nav className="text-sm text-[var(--color-muted)] mb-8">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-white">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 2xl:gap-20">
        <ProductGallery
          images={gallery}
          productName={product.name}
          showGlideBackground={usesTripadGlideBackground(product.slug)}
        />

        <div>
          {product.tag && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white text-black px-2 py-0.5 mb-3">
              {product.tag}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StarRating value={avgRating} />
            <span className="text-sm text-[var(--color-muted)]">
              {reviews.length > 0 ? (
                <a href="#reviews" className="hover:text-white hover:underline">
                  ({reviews.length} customer review{reviews.length !== 1 ? "s" : ""})
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

          <div className="mb-6">
            <ProductPrice
              price={product.price}
              compareAt={product.compareAt}
              tag={product.tag}
            />
          </div>

          <p className="text-sm text-[var(--color-muted)] leading-relaxed tracking-[0.01em] normal-case mb-6">
            {product.description}
          </p>

          {features.length > 0 && (
            <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
              <ProductFeaturesList
                features={features.slice(0, 5)}
                title="Highlights"
              />
              {features.length > 5 && (
                <a
                  href="#product-details"
                  className="inline-block mt-3 text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-white hover:underline"
                >
                  See all features & details
                </a>
              )}
            </div>
          )}

          {selectedColor && colors.length > 0 && (
            <ProductColorPicker
              colors={colors}
              selected={selectedColor}
              onSelect={setSelectedColor}
            />
          )}

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
            }}
            color={selectedColor?.name}
            comingSoon={upcoming}
          />

          <dl className="mt-8 pt-6 border-t border-[var(--color-border)] text-sm space-y-2">
            {product.sku && (
              <div className="flex gap-2">
                <dt className="text-[var(--color-muted)] shrink-0">SKU:</dt>
                <dd className="font-mono">{product.sku}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-[var(--color-muted)] shrink-0">Category:</dt>
              <dd>
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:underline"
                >
                  {product.category}
                </Link>
              </dd>
            </div>
          </dl>
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
    </div>
  );
}
