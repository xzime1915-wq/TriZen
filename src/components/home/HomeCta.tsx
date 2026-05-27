import Link from "next/link";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] min-h-[50vh] flex items-center">
      <div
        className="trizen-glow-orb pointer-events-none absolute left-1/2 top-1/2 h-[min(80vw,520px)] w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-100/80 to-transparent"
        aria-hidden
      />

      <div className="container-trizen relative py-20 md:py-28 w-full text-center">
        <p className="trizen-eyebrow">Ready</p>
        <h2 className="trizen-headline mt-6 text-3xl sm:text-4xl md:text-5xl max-w-3xl mx-auto leading-tight">
          Upgrade your desk.
          <br />
          Upgrade your aim.
        </h2>
        <p className="trizen-body mt-6 max-w-md mx-auto">
          Premium esports gear — shipped across Bangladesh.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="trizen-btn-primary">
            Shop now
          </Link>
          <Link href="/contact" className="trizen-btn-primary">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
