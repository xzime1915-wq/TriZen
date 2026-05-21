export function ShopMarquee() {
  const text = "SHOP · TRIZEN · GLASS · ESPORTS · ";
  const line = text.repeat(6);

  return (
    <div
      className="relative border-b border-[var(--color-border)] bg-black py-5 overflow-hidden"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent"
        aria-hidden
      />
      <div className="home-marquee-track flex whitespace-nowrap">
        <span className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-zinc-800/80">
          {line}
        </span>
        <span className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-zinc-800/80">
          {line}
        </span>
      </div>
    </div>
  );
}
