export function HomeStatement() {
  return (
    <section className="relative overflow-hidden bg-black border-b border-[var(--color-border)]">
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[min(60vw,400px)] w-[min(50vw,320px)] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"
        aria-hidden
      />
      <div className="container-trizen relative py-24 md:py-32 lg:py-40 min-h-[70vh] flex flex-col justify-center">
        <p className="trizen-eyebrow mb-8">Philosophy</p>
        <h2 className="trizen-headline max-w-4xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
          Less friction.
          <br />
          <span className="trizen-metallic-muted">More control.</span>
        </h2>
        <p className="trizen-body mt-10 max-w-2xl md:text-base">
          TriZen builds gear for players who care about consistency. Our glass
          surface is tuned for speed without sacrificing stability — so every
          flick, track, and micro-adjustment feels intentional.
        </p>
        <p className="mt-6 max-w-2xl text-sm text-zinc-600 leading-relaxed">
          Designed in Bangladesh for local esports communities. Ships nationwide
          with Cash on Delivery, bKash, Nagad, and bank transfer.
        </p>
      </div>
    </section>
  );
}
