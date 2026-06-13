const STEPS = [
  { n: "01", title: "Choose your gear" },
  { n: "02", title: "Pay your way" },
  { n: "03", title: "We ship fast" },
  { n: "04", title: "Play to win" },
];

export function HomeProcess() {
  return (
    <section className="trizen-process-section bg-white py-12 md:py-20 lg:py-24">
      <div className="container-trizen-full">
        <div className="mb-8 text-center md:mb-12">
          <p className="trizen-process-eyebrow">How it works</p>
          <h2 className="trizen-display-title mt-4">Order to desk</h2>
        </div>

        <div className="trizen-process-grid">
          {STEPS.map((step) => (
            <article key={step.n} className="trizen-process-card">
              <span className="trizen-process-num">{step.n}</span>
              <h3 className="trizen-process-title">{step.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
