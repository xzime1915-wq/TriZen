import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { StarRating } from "@/components/product/StarRating";
import { HomeProductActions } from "./HomeProductActions";
import { shouldShowProductPrice } from "@/lib/product-status";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { isUpcoming } from "@/lib/product-status";
import { usesTripadGlideBackgroundOnHome } from "@/lib/product-visuals";
import { ProductGlideBackground } from "@/components/product/ProductGlideBackground";

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
  /** Shown in headline when visual shows multiple editions (e.g. black + white duo). */
  displayName?: string;
};

export function HomeProductShowcase({
  product,
  features,
  avgRating,
  reviewCount,
  visualImage,
  reverse = false,
  displayName,
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
  const showGlide = usesTripadGlideBackgroundOnHome(product.slug);
  const isBlackPad = product.slug.includes("black");

  return (
    <section className="relative border-t border-[var(--color-border)] bg-black overflow-hidden">
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)]"
        aria-hidden
      />
      <div className="container-trizen relative py-20 md:py-28 lg:py-36 min-h-[85vh] flex flex-col justify-center">
        <p className="trizen-eyebrow mb-10 md:mb-14">
          {upcoming ? "Upcoming" : "Featured"}
        </p>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div
            className={`relative w-full overflow-hidden min-h-[420px] sm:min-h-[500px] lg:min-h-[580px] ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {showGlide && <ProductGlideBackground />}
            <Link
              href={`/product/${product.slug}`}
              className="relative z-20 block w-full min-h-[420px] sm:min-h-[500px] lg:min-h-[580px]"
            >
              {showGlide && isBlackPad && (
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_42%,rgba(255,255,255,0.14)_0%,transparent_68%)]"
                  aria-hidden
                />
              )}
              <ProductImage
                src={mainVisual}
                alt={headline}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={
                  showGlide
                    ? "p-6 sm:p-10 object-contain object-center pb-24"
                    : "p-0 sm:p-2 object-contain object-center"
                }
              />
            </Link>
          </div>

          <div
            className={`flex flex-col w-full max-w-lg lg:pt-2 ${
              reverse ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <StockBadge
                inStock={isInStock(product.stock)}
                upcoming={upcoming}
                size="md"
              />
            </div>

            <Link href={`/product/${product.slug}`}>
              <h2 className="trizen-headline text-2xl sm:text-3xl transition-colors hover:text-zinc-200">
                {headline}
              </h2>
            </Link>

            {shouldShowProductPrice(product.tag) && (
              <p className="mt-4 text-lg font-medium text-white tabular-nums">
                {formatCurrency(product.price)}
                {product.compareAt && product.compareAt > product.price && (
                  <span className="ml-2 text-sm text-zinc-600 line-through font-normal">
                    {formatCurrency(product.compareAt)}
                  </span>
                )}
              </p>
            )}

            <div className="trizen-body mt-10 space-y-5 text-center">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <StarRating value={avgRating || 5} />
              <span className="text-xs text-zinc-600">
                {reviewCount > 0 ? `(${avgRating})` : "(New)"}
              </span>
            </div>

            <div className="mt-10">
              <HomeProductActions slug={product.slug} tag={product.tag} />
            </div>

            {highlightFeatures.length > 0 && (
              <ul className="mt-12 space-y-4 border-t border-[var(--color-border)] pt-10">
                {highlightFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-zinc-500"
                  >
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
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
