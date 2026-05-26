type Props = {
  count: number;
  activeGearLabel?: string;
  query?: string;
};

export function ShopHero({ count, activeGearLabel, query }: Props) {
  const subtitle = query
    ? `Results for “${query}”`
    : activeGearLabel
      ? activeGearLabel
      : "Esports mouse pad in Bangladesh — glass TriPad, soft pads, skates & sleeves";

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-black">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_0%,rgba(255,255,255,0.04)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="container-trizen relative pt-20 pb-8 md:pt-32 md:pb-20">
        <p className="trizen-eyebrow text-[8px] tracking-[0.28em] md:text-xs">
          TriZen Store
        </p>
        <h1 className="trizen-headline mt-2 text-[1.25rem] leading-tight md:mt-4 md:text-6xl sm:text-5xl">
          Shop
        </h1>
        <p className="mt-2 max-w-md text-[0.7rem] leading-[1.5] text-zinc-500 md:mt-5 md:max-w-2xl md:text-lg">
          {subtitle}
        </p>
        <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-zinc-600 md:mt-8 md:text-xs md:tracking-[0.22em]">
          {count} {count === 1 ? "product" : "products"} listed below
        </p>
      </div>
    </section>
  );
}
