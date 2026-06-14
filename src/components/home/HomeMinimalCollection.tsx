import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatCurrency } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  image: string;
  stock: number;
};

export function HomeMinimalCollection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-[var(--color-surface)]">
      <div className="container-trizen py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
              Collection
            </p>
            <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-[var(--color-foreground)]">
              More from TRIZEN
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-[var(--color-foreground)] shrink-0"
          >
            Shop all
          </Link>
        </div>

        <ul className="divide-y divide-[var(--color-border)]">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/product/${p.slug}`}
                className="group grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr_auto] gap-6 sm:gap-10 py-10 md:py-12 items-center"
              >
                <div className="relative aspect-square bg-zinc-50 border border-[var(--color-border)] overflow-hidden">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    sizes="140px"
                    className="p-4 object-contain transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide text-[var(--color-foreground)] group-hover:underline">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <p className="hidden sm:block text-base font-medium text-[var(--color-foreground)] tabular-nums shrink-0">
                  {formatCurrency(p.price)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
