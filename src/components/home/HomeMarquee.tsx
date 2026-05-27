export function HomeMarquee() {
  const line = "TRIZEN · TRIPAD · ESPORTS · BANGLADESH · ";
  const repeated = line.repeat(8);

  return (
    <section
      className="relative border-y border-[var(--color-border)] bg-[var(--color-surface)] py-4 sm:py-7 overflow-hidden"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/80 to-transparent"
        aria-hidden
      />
      <div className="home-marquee-track flex whitespace-nowrap">
        <span className="home-marquee-text text-sm sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.12em] sm:tracking-tight text-zinc-800/90 select-none">
          {repeated}
        </span>
        <span className="home-marquee-text text-sm sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.12em] sm:tracking-tight text-zinc-800/90 select-none">
          {repeated}
        </span>
      </div>
    </section>
  );
}
