type Props = {
  count: number;
  activeCategory?: string;
  query?: string;
};

export function ShopHero({ count, activeCategory, query }: Props) {
  const subtitle = query
    ? `Results for “${query}”`
    : activeCategory
      ? activeCategory
      : "Premium esports gear — mouse pads & accessories";

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-black">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_0%,rgba(255,255,255,0.04)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="container-trizen relative pt-28 pb-14 md:pt-32 md:pb-20">
        <p className="trizen-eyebrow">TriZen Store</p>
        <h1 className="trizen-headline mt-4 text-4xl sm:text-5xl md:text-6xl">
          Shop
        </h1>
        <p className="trizen-body mt-5 max-w-2xl text-base sm:text-lg text-zinc-400">
          {subtitle}
        </p>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/90">
          Browse TriPad by generation — V1 editions in stock now, V2 launching soon
          with refreshed vertical TriZen branding. Glass glide built for competitive
          play in Bangladesh.
        </p>
        <p className="mt-8 text-xs uppercase tracking-[0.22em] text-zinc-600">
          {count} {count === 1 ? "product" : "products"} · V1 & V2 clearly listed below
        </p>
      </div>
    </section>
  );
}
