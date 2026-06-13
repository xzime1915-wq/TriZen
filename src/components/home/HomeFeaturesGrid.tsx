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
    <section className="bg-white">
      <div className="container-trizen mx-auto max-w-3xl py-20 md:py-28">
        <h2 className="trizen-display-title mb-10 md:mb-14">Built different</h2>

        <div className="trizen-divider-list">
          {FEATURES.map((f) => (
            <div key={f.title} className="trizen-divider-list-item">
              <h3 className="text-sm font-light normal-case tracking-normal text-zinc-900 md:text-base">
                {f.title}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-zinc-900 md:text-base">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
