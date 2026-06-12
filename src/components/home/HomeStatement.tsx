export function HomeStatement() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[min(60vw,400px)] w-[min(50vw,320px)] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04)_0%,transparent_70%)]"
        aria-hidden
      />
      <div className="container-trizen relative flex flex-col justify-center py-16 md:py-32 lg:py-40 md:min-h-[70vh]">
        <p className="trizen-eyebrow mb-6 md:mb-8">Philosophy</p>
        <h2 className="trizen-headline max-w-4xl text-2xl leading-[1.15] md:text-5xl lg:text-6xl">
          Less friction.
          <br />
          <span className="trizen-metallic-muted">More control.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-[0.8125rem] leading-[1.6] text-zinc-500 sm:mt-8 sm:text-sm md:mt-10 md:text-base md:leading-relaxed">
          TRIZEN builds gear for players who care about consistency. Our glass
          surface is tuned for speed without sacrificing stability, so every
          flick, track, and micro-adjustment feels intentional.
        </p>
      </div>
    </section>
  );
}
