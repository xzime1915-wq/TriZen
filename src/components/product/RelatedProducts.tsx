import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

type RelatedProduct = {
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

export function RelatedProducts({
  products,
  category,
}: {
  products: RelatedProduct[];
  category: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[var(--color-border)]">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest">Related Products</h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            More from {category}
          </p>
        </div>
        <Link
          href={`/shop?category=${encodeURIComponent(category)}`}
          className="text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
