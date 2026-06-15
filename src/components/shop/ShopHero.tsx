import { TrizenBrandName } from "@/components/TrizenBrandName";

type Props = {
  count: number;
  activeGearLabel?: string;
  query?: string;
};

export function ShopHero({ count, activeGearLabel, query }: Props) {
  const title = query ? "Search" : activeGearLabel ?? "All Products";

  const subtitle = query
    ? `Results for “${query}”`
    : activeGearLabel
      ? `Browse ${activeGearLabel.toLowerCase()} from TRIZEN Store.`
      : "Esports mouse pads, glass TRIPAD, soft pads, skates and sleeves, built for competitive play in Bangladesh.";

  return (
    <section className="shop-hero bg-white">
      <div className="container-trizen-full py-10 md:py-14 lg:py-16">
        <p className="flex flex-wrap items-baseline gap-x-[0.35em]">
          <TrizenBrandName className="trizen-wh-hero-eyebrow text-zinc-900" />
          <span className="trizen-wh-hero-eyebrow text-zinc-900">Store</span>
        </p>

        <h1 className="trizen-shop-title mt-3 text-[clamp(1.75rem,5vw,3.25rem)] md:mt-4 md:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="trizen-wh-mono mt-4 max-w-2xl text-[10px] uppercase leading-relaxed tracking-[0.16em] text-zinc-900 md:mt-5">
          {subtitle}
        </p>

        <p className="trizen-wh-hero-eyebrow mt-5 text-zinc-900 md:mt-6">
          {count} {count === 1 ? "Product" : "Products"}
        </p>
      </div>
    </section>
  );
}
