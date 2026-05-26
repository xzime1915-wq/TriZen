import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { StarRating } from "@/components/product/StarRating";
import { HomeProductActions } from "./HomeProductActions";
import { shouldShowProductPrice } from "@/lib/product-status";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { isUpcoming } from "@/lib/product-status";

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

  const padCol = reverse
    ? "lg:col-start-2 lg:row-start-1"
    : "lg:col-start-1 lg:row-start-1";
  const copyCol = reverse
    ? "lg:col-start-1 lg:row-start-1"
    : "lg:col-start-2 lg:row-start-1";

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="product-page-pad relative py-12 md:py-16 lg:py-20">
        <p className="trizen-eyebrow mb-6 md:mb-10">Featured</p>

        <div
          className={`grid grid-cols-1 items-stretch gap-10 lg:gap-12 xl:gap-16 ${
            reverse
              ? "lg:grid-cols-[minmax(280px,0.88fr)_minmax(0,1.12fr)]"
              : "lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)]"
          }`}
        >
          <div
            className={`flex min-h-[min(88vw,460px)] min-w-0 sm:min-h-[520px] lg:min-h-[min(72vh,740px)] ${padCol}`}
          >
            <Link
              href={`/product/${product.slug}`}
              className="group relative flex w-full flex-1"
            >
              <div className="relative h-full min-h-[inherit] w-full overflow-hidden bg-zinc-100">
                <div className="absolute inset-0 p-2 sm:p-3">
                  <ProductImage
                    src={mainVisual}
                    alt={headline}
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className={`flex min-w-0 flex-col justify-center py-2 lg:py-4 ${copyCol}`}>
            <div className="mb-4">
              <StockBadge
                inStock={isInStock(product.stock)}
                upcoming={upcoming}
                size="md"
              />
            </div>

            <Link href={`/product/${product.slug}`}>
              <h2 className="trizen-headline text-2xl transition-colors hover:text-zinc-600 sm:text-3xl lg:text-[2rem]">
                {headline}
              </h2>
            </Link>

            {shouldShowProductPrice(product.tag) && (
              <p className="mt-3 text-lg font-medium tabular-nums text-[var(--color-foreground)]">
                {formatCurrency(product.price)}
                {product.compareAt && product.compareAt > product.price && (
                  <span className="ml-2 text-sm font-normal text-zinc-600 line-through">
                    {formatCurrency(product.compareAt)}
                  </span>
                )}
              </p>
            )}

            <div className="trizen-body mt-6 max-w-xl space-y-4 text-left">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <StarRating value={avgRating || 5} />
              <span className="text-xs text-zinc-600">
                {reviewCount > 0 ? `(${avgRating})` : "(New)"}
              </span>
            </div>

            <div className="mt-8">
              <HomeProductActions slug={product.slug} tag={product.tag} />
            </div>

            {highlightFeatures.length > 0 && (
              <ul className="mt-10 max-w-xl space-y-3 border-t border-[var(--color-border)] pt-8">
                {highlightFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-zinc-500"
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
