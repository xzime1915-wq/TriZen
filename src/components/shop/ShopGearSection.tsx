import { ShopProductCard } from "./ShopProductCard";
import { SHOP_GEAR_COPY } from "@/lib/shop-gears";
import type { ShopGearLine } from "@/lib/shop-gears";

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

export function ShopGearSection({
  gear,
  products,
  showWhenEmpty = false,
}: {
  gear: ShopGearLine;
  products: ShopProduct[];
  /** Full shop view — show gear header even with no products yet */
  showWhenEmpty?: boolean;
}) {
  if (products.length === 0 && !showWhenEmpty) return null;

  const copy = SHOP_GEAR_COPY[gear];
  const isUpcoming = copy.statusLabel === "Upcoming";

  return (
    <section
      id={`gear-${gear}`}
      className="scroll-mt-28 border-t border-[var(--color-border)] first:border-t-0"
    >
      <div className="border-b border-[var(--color-border)] bg-zinc-950/20 py-8 md:py-20 lg:py-24">
        <p className="trizen-eyebrow text-[8px] tracking-[0.28em] md:text-xs">{copy.eyebrow}</p>
        <h2 className="trizen-headline mt-2 max-w-[12rem] text-[1.25rem] leading-[1.1] md:mt-4 md:max-w-none md:text-5xl sm:text-4xl">
          {copy.title}
        </h2>
        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.28em] text-amber-400 md:mt-3 md:text-[10px] md:tracking-[0.32em]">
          {copy.statusLabel}
        </p>
        <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-zinc-500 md:mt-8 md:text-sm md:tracking-[0.2em]">
          {products.length > 0
            ? `${products.length} ${products.length === 1 ? "product" : "products"}${isUpcoming ? " · upcoming" : ""}`
            : "Coming soon"}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10 xl:gap-12">
            {products.map((p) => (
              <ShopProductCard
                key={p.slug}
                product={p}
                editionLabel={copy.title}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="py-14 text-center text-sm uppercase tracking-[0.2em] text-zinc-600 md:py-20">
          Products launching soon — stay tuned
        </p>
      )}
    </section>
  );
}
