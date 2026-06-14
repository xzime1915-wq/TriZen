import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { isUpcoming, shouldShowProductPrice } from "@/lib/product-status";
import { ProductCardTitle } from "@/components/product/ProductCardTitle";
import { ProductHoverAction } from "@/components/product/ProductHoverAction";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  tag: string | null;
};

function previewText(product: Product) {
  const fromLong = product.longDescription
    ?.split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)[0];
  return fromLong || product.description;
}

export function ShopProductCard({
  product,
  editionLabel,
  compact = false,
}: {
  product: Product;
  editionLabel?: string;
  compact?: boolean;
}) {
  const upcoming = isUpcoming(product.tag);

  if (compact) {
    return (
      <article className="group block">
        <div
          className={cn(
            "shop-product-card-visual relative aspect-square overflow-hidden border border-zinc-200 bg-white transition-colors duration-200 group-hover:border-zinc-900",
            upcoming && "shop-product-card-visual--upcoming"
          )}
        >
          <Link href={`/product/${product.slug}`} className="block h-full">
            <div className="relative z-[2] flex h-full w-full items-center justify-center p-3 sm:p-4">
              <ProductImage
                src={product.image}
                alt={product.name}
                sizes="(max-width: 768px) 50vw, 25vw"
                className={cn(
                  "max-h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.02]",
                  upcoming && "opacity-45"
                )}
              />
            </div>
          </Link>

          <ProductHoverAction product={product} />

          {upcoming ? (
            <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
              <span className="trizen-wh-hero-eyebrow text-[10px] tracking-[0.32em] text-zinc-500">
                Upcoming
              </span>
            </div>
          ) : null}
        </div>

        <Link href={`/product/${product.slug}`} className="product-card-meta block">
          <ProductCardTitle
            name={product.name}
            className="text-[10px] leading-snug md:text-[11px]"
          />
          {shouldShowProductPrice(product.tag) ? (
            <p className="product-card-price product-inline-price">
              {formatCurrency(product.price)}
            </p>
          ) : (
            <p className="product-card-price product-inline-price text-zinc-600">
              Price at launch
            </p>
          )}
        </Link>
      </article>
    );
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col border border-zinc-200 bg-white transition-colors duration-200 hover:border-zinc-900"
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-square shop-product-card-visual">
        <div className="relative z-[2] flex h-full w-full items-center justify-center p-6 sm:p-8">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              "max-h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.02]",
              upcoming && "opacity-45"
            )}
          />
        </div>
        {upcoming ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="trizen-wh-hero-eyebrow text-[10px] tracking-[0.32em] text-zinc-500">
              Upcoming
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col border-t border-zinc-200 p-4 sm:p-5">
        {editionLabel ? (
          <span className="trizen-wh-hero-eyebrow text-zinc-400">{editionLabel}</span>
        ) : (
          <p className="trizen-wh-hero-eyebrow text-zinc-400">{product.category}</p>
        )}
        <ProductCardTitle
          name={product.name}
          className="mt-2 text-sm md:text-base"
        />
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500">
          {previewText(product)}
        </p>
        <div className="mt-4 border-t border-zinc-200 pt-3">
          {shouldShowProductPrice(product.tag) ? (
            <p className="product-inline-price">
              {formatCurrency(product.price)}
            </p>
          ) : (
            <p className="product-inline-price text-zinc-600">
              Price at launch
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
