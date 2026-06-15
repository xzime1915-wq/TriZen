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
      <div className="container-trizen py-20 md:py-28">
        <h2 className="trizen-display-title mb-10 md:mb-14">Built different</h2>

        <div className="trizen-divider-list trizen-divider-list--split">
          {FEATURES.map((f) => (
            <div key={f.title} className="trizen-divider-list-item trizen-feature-row">
              <h3 className="trizen-feature-title">{f.title}</h3>
              <p className="trizen-feature-desc">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
