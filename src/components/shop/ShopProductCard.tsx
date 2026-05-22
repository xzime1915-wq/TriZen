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
        <div className="relative z-10 h-full w-full">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={
              showGlide
                ? "p-6 sm:p-10 object-contain object-top pb-14 transition duration-700 group-hover:scale-[1.03]"
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

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10 border-t border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2">
          {editionLabel && (
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 border border-[var(--color-border)] px-2.5 py-1">
              {editionLabel}
            </span>
          )}
          <p className="trizen-eyebrow text-zinc-600">{product.category}</p>
        </div>
        <h2 className="mt-4 text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug group-hover:underline">
          {product.name}
        </h2>
        <p className="mt-4 text-base text-zinc-400 line-clamp-3 leading-relaxed">
          {product.description}
        </p>
        <p className="mt-4 text-base sm:text-lg text-white/90 line-clamp-4 leading-relaxed flex-1">
          {previewText(product)}
        </p>
        <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex items-end justify-between gap-4">
          {shouldShowProductPrice(product.tag) ? (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
                Price
              </p>
              <p className="text-xl font-semibold text-white tabular-nums">
                {formatCurrency(product.price)}
              </p>
              {product.compareAt && product.compareAt > product.price && (
                <p className="text-xs text-zinc-600 line-through mt-1">
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
