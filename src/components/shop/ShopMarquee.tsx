export function ShopMarquee() {
  const text = "SHOP · TRIZEN · TRIPAD · ESPORTS · BANGLADESH · ";
  const line = text.repeat(8);

  return (
    <section
      className="trizen-section-dark home-marquee-dark relative border-y border-[var(--color-border)] bg-[var(--color-surface)] py-4 sm:py-7 overflow-hidden"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="home-marquee-track relative z-[1] flex whitespace-nowrap">
        <span className="home-marquee-text home-marquee-text--dark text-sm sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.12em] sm:tracking-tight select-none">
          {line}
        </span>
        <span className="home-marquee-text home-marquee-text--dark text-sm sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.12em] sm:tracking-tight select-none">
          {line}
        </span>
      </div>
    </section>
  );
}
