const FEATURES = [
  {
    title: "Tempered glass",
    body: "Ultra smooth surface tuned for competitive glide and consistent feel.",
  },
  {
    title: "Esports first",
    body: "Built for FPS, MOBA, and battle royale, precision flicks and tracking.",
  },
  {
    title: "Stable base",
    body: "Non slip grip keeps your pad locked during intense matches.",
  },
  {
    title: "Easy care",
    body: "Wipe clean in seconds, no complicated maintenance.",
  },
  {
    title: "All mice",
    body: "Compatible with wired and wireless gaming mice.",
  },
  {
    title: "Nationwide",
    body: "Order from anywhere in Bangladesh with flexible payment.",
  },
];

export function HomeFeaturesGrid() {
  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="container-trizen py-20 md:py-28">
        <p className="trizen-eyebrow mb-4">Why TRIPAD</p>
        <h2 className="trizen-headline text-2xl md:text-3xl mb-14 md:mb-20">
          Built different
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 md:gap-y-16">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group border-t border-[var(--color-border)] pt-8 transition-colors duration-300 hover:border-zinc-600"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-foreground)] transition-colors group-hover:text-zinc-200">
                {f.title}
              </h3>
              <p className="trizen-body mt-4">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
