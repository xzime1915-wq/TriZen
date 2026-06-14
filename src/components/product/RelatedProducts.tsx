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
    <section className="border-t border-zinc-200 pt-12 md:pt-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
        <div>
          <h2 className="trizen-wh-section-label md:text-2xl">Recently viewed</h2>
          <p className="product-section-eyebrow mt-2">More from {category}</p>
        </div>
        <Link href={`/shop?gear=${encodeURIComponent(category)}`} className="trizen-wh-ghost-btn">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
