"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  { n: "01", title: "Choose your gear" },
  { n: "02", title: "Pay your way" },
  { n: "03", title: "We ship fast" },
  { n: "04", title: "Play to win" },
];

export function HomeProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const wasInViewRef = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && !wasInViewRef.current) setInView(true);
        else if (!visible) setInView(false);
        wasInViewRef.current = visible;
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`trizen-section-dark trizen-process-section relative overflow-hidden ${
        inView ? "trizen-process-inview" : ""
      }`}
    >
      <div className="container-trizen relative py-24 md:py-32 lg:py-36">
        <div className="mb-14 md:mb-16 lg:mb-20">
          <p className="trizen-eyebrow trizen-process-item">How it works</p>
          <h2 className="trizen-headline trizen-process-headline trizen-process-item trizen-process-item-delay-1 mt-4 text-3xl md:text-4xl lg:text-5xl">
            Order to desk
          </h2>
        </div>

        <div className="relative">
          <div
            className="trizen-process-track pointer-events-none absolute left-[8%] right-[8%] top-[1.75rem] hidden overflow-hidden lg:block"
            aria-hidden
          >
            <span className="trizen-process-beam" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                style={{ "--step-i": i } as React.CSSProperties}
                className={[
                  "trizen-process-card trizen-process-item group",
                  i === 0 && "trizen-process-item-delay-2",
                  i === 1 && "trizen-process-item-delay-3",
                  i === 2 && "trizen-process-item-delay-4",
                  i === 3 && "trizen-process-item-delay-5",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="trizen-process-shine" aria-hidden />
                <span className="trizen-process-num">
                  <span className="trizen-process-num-ring" aria-hidden />
                  {s.n}
                </span>
                <h3 className="trizen-process-title">{s.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
