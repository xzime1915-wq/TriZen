import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge, isInStock } from "@/components/StockBadge";
import { isUpcoming, shouldShowProductPrice } from "@/lib/product-status";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  tag?: string | null;
};

export function ProductCard({ product }: { product: Product }) {
  const inStock = isInStock(product.stock);
  const upcoming = isUpcoming(product.tag);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition hover:border-zinc-500"
    >
      <div className="relative aspect-square overflow-hidden bg-transparent">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, 25vw"
          className="p-2 sm:p-4 object-contain"
        />
        <div className="absolute top-3 left-3">
          <StockBadge inStock={inStock} upcoming={upcoming} />
        </div>
        {!upcoming && !inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold uppercase">
            Out of Stock
          </span>
        )}
        {upcoming && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold uppercase">
            Upcoming
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        {shouldShowProductPrice(product.tag) && (
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{formatCurrency(product.price)}</span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-xs text-[var(--color-muted)] line-through">
                {formatCurrency(product.compareAt)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
