import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { isUpcoming, shouldShowProductPrice } from "@/lib/product-status";
import { usesTripadGlideBackground } from "@/lib/product-visuals";
import { ProductGlideBackground } from "@/components/product/ProductGlideBackground";
import { ArrowUpRight } from "lucide-react";

type Product = {
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
}: {
  product: Product;
  editionLabel?: string;
}) {
  const inStock = isInStock(product.stock);
  const upcoming = isUpcoming(product.tag);
  const showGlide = usesTripadGlideBackground(product.slug);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="trizen-card-hover group relative flex flex-col border border-[var(--color-border)] bg-black"
    >
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-transparent">
        {showGlide && <ProductGlideBackground />}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(255,255,255,0.04)_0%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <div className="relative z-10 h-full w-full max-md:pt-12">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={
              showGlide
                ? "max-md:object-[50%_62%] p-6 pb-14 pt-2 object-contain object-top transition duration-700 group-hover:scale-[1.03] sm:p-10 sm:pt-10"
                : "p-2 sm:p-4 object-contain transition duration-700 group-hover:scale-[1.03]"
            }
          />
        </div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <StockBadge inStock={inStock} upcoming={upcoming} />
          {product.tag && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-2 py-0.5">
              {product.tag}
            </span>
          )}
        </div>
        {upcoming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              Upcoming
            </span>
          </div>
        )}
        {!upcoming && !inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Out of Stock
            </span>
          </div>
        )}
        <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center border border-[var(--color-border)] bg-black/80 text-zinc-400 transition group-hover:border-white group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-[var(--color-border)] p-4 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {editionLabel && (
            <span className="border border-[var(--color-border)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-400 md:px-2.5 md:py-1 md:text-xs md:tracking-[0.2em]">
              {editionLabel}
            </span>
          )}
          {!editionLabel && (
            <p className="trizen-eyebrow text-[8px] tracking-[0.28em] text-zinc-600 md:text-xs">
              {product.category}
            </p>
          )}
        </div>
        <h2 className="mt-2 text-[1.05rem] font-bold uppercase leading-[1.15] tracking-tight text-white group-hover:underline md:mt-4 md:text-2xl md:leading-snug">
          {product.name}
        </h2>
        <p className="mt-2 line-clamp-3 text-[0.7rem] leading-[1.5] text-zinc-400 md:mt-4 md:text-base md:leading-relaxed">
          {product.description}
        </p>
        <p className="mt-2 line-clamp-4 flex-1 text-[0.7rem] leading-[1.5] text-white/90 md:mt-4 md:text-base md:leading-relaxed lg:text-lg">
          {previewText(product)}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-4 md:mt-6 md:pt-6">
          {shouldShowProductPrice(product.tag) ? (
            <div>
              <p className="mb-0.5 text-[9px] uppercase tracking-[0.2em] text-zinc-600 md:mb-1 md:text-[10px] md:tracking-widest">
                Price
              </p>
              <p className="text-[1rem] font-semibold tabular-nums text-white md:text-xl">
                {formatCurrency(product.price)}
              </p>
              {product.compareAt && product.compareAt > product.price && (
                <p className="mt-0.5 text-[10px] text-zinc-600 line-through md:mt-1 md:text-xs">
                  {formatCurrency(product.compareAt)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">
              Price at launch
            </p>
          )}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
