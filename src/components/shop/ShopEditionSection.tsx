import { ShopProductCard } from "./ShopProductCard";
import { SHOP_EDITION_COPY } from "@/lib/shop-editions";
import type { ShopEdition } from "@/lib/shop-editions";

type ShopProduct = {
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

export function ShopEditionSection({
  edition,
  products,
}: {
  edition: ShopEdition;
  products: ShopProduct[];
}) {
  if (products.length === 0) return null;

  const copy = SHOP_EDITION_COPY[edition];

  return (
    <section className="border-t border-[var(--color-border)] first:border-t-0">
      <div className="py-14 md:py-20 lg:py-24 border-b border-[var(--color-border)] bg-zinc-950/20">
        <p className="trizen-eyebrow">{copy.eyebrow}</p>
        <h2 className="trizen-headline mt-4 text-3xl sm:text-4xl md:text-5xl">
          {copy.title}
        </h2>
        <div className="mt-8 max-w-3xl space-y-5 text-base sm:text-lg leading-relaxed text-white">
          {copy.intro.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>
        <p className="mt-8 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {products.length} {products.length === 1 ? "edition" : "editions"} in
          this line
        </p>
      </div>

      <div className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10 xl:gap-12">
          {products.map((p) => (
            <ShopProductCard
              key={p.slug}
              product={p}
              editionLabel={edition === "other" ? undefined : copy.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
