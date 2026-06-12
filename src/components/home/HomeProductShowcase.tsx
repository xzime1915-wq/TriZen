import Link from "next/link";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { StarRating } from "@/components/product/StarRating";
import { ProductVisualFrame } from "@/components/product/ProductVisualFrame";
import { HomeProductActions } from "./HomeProductActions";
import { shouldShowProductPrice } from "@/lib/product-status";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { isUpcoming } from "@/lib/product-status";
import { getLargeProductImageScale } from "@/lib/product-visual-scale";

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
    stock: number;
    sku: string | null;
    tag?: string | null;
  };
  features: string[];
  avgRating: number;
  reviewCount: number;
  visualImage?: string;
  reverse?: boolean;
  displayName?: string;
  priority?: boolean;
};

export function HomeProductShowcase({
  product,
  features,
  avgRating,
  reviewCount,
  visualImage,
  reverse = false,
  displayName,
  priority = false,
}: Props) {
  const headline = displayName ?? product.name;
  const paragraphs = (product.longDescription || product.description)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 3);

  const highlightFeatures = features.slice(0, 3);
  const upcoming = isUpcoming(product.tag);
  const mainVisual = visualImage || product.image;
  const featuredScale = getLargeProductImageScale(mainVisual);

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="product-page-pad relative py-10 sm:py-12 md:py-16 lg:py-20">
        <p className="trizen-eyebrow mb-4 text-[8px] tracking-[0.28em] sm:mb-6 sm:text-xs md:mb-10">
          Featured
        </p>

        <div
          className={`product-split-grid ${
            reverse
              ? "product-split-grid--featured-reverse"
              : "product-split-grid--featured"
          }`}
        >
          <div className={reverse ? "min-w-0 lg:order-2" : "min-w-0"}>
            <Link
              href={`/product/${product.slug}`}
              className="group block w-full"
            >
              <ProductVisualFrame
                src={mainVisual}
                alt={headline}
                variant="large"
                sizes="(max-width: 1024px) 100vw, 60vw"
                imageScale={featuredScale}
                interactive
                priority={priority}
              />
            </Link>
          </div>

          <div
            className={`flex min-w-0 flex-col py-2 md:py-4 ${
              reverse ? "lg:order-1" : ""
            }`}
          >
            <div className="mb-3 sm:mb-4">
              <StockBadge
                inStock={isInStock(product.stock)}
                upcoming={upcoming}
                size="md"
              />
            </div>

            <Link href={`/product/${product.slug}`}>
              <h2 className="trizen-headline text-xl transition-colors hover:text-zinc-600 sm:text-2xl md:text-3xl lg:text-[2rem]">
                {headline}
              </h2>
            </Link>

            {shouldShowProductPrice(product.tag) && (
              <p className="mt-2 text-base font-medium tabular-nums text-[var(--color-foreground)] sm:mt-3 sm:text-lg">
                {formatCurrency(product.price)}
                {product.compareAt && product.compareAt > product.price && (
                  <span className="ml-2 text-sm font-normal text-zinc-600 line-through">
                    {formatCurrency(product.compareAt)}
                  </span>
                )}
              </p>
            )}

            <div className="home-product-copy mt-4 max-w-md text-left sm:mt-6">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <StarRating value={avgRating || 5} />
              <span className="text-xs text-zinc-600">
                {reviewCount > 0 ? `(${avgRating})` : "(New)"}
              </span>
            </div>

            <div className="mt-6 sm:mt-8">
              <HomeProductActions
                slug={product.slug}
                productName={headline}
                tag={product.tag}
              />
            </div>

            {highlightFeatures.length > 0 && (
              <ul className="mt-7 max-w-xl space-y-2.5 border-t border-[var(--color-border)] pt-6 sm:mt-10 sm:space-y-3 sm:pt-8">
                {highlightFeatures.map((f) => (
                  <li
                    key={f}
                    className="trizen-detail flex items-start gap-3"
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
