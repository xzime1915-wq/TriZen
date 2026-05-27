"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Choose your gear",
    body: "Browse TriPad editions and shop in seconds.",
  },
  {
    n: "02",
    title: "Pay your way",
    body: "COD, bKash, Nagad, or bank transfer — whatever suits you.",
  },
  {
    n: "03",
    title: "We ship fast",
    body: "Your order is packed and sent across Bangladesh.",
  },
  {
    n: "04",
    title: "Play to win",
    body: "Unbox, set up, and feel the glide from day one.",
  },
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
      className={`trizen-process-section relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] ${
        inView ? "trizen-process-inview" : ""
      }`}
    >
      <div
        className="trizen-glow-orb pointer-events-none absolute left-1/2 top-0 h-64 w-[min(90vw,640px)] -translate-x-1/2 opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(255,255,255,0.03)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="container-trizen relative py-24 md:py-32 lg:py-36">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="trizen-eyebrow trizen-process-item">How it works</p>
          <h2 className="trizen-headline trizen-process-item trizen-process-item-delay-1 mt-4 text-3xl md:text-4xl lg:text-5xl">
            Order to desk
          </h2>
          <p className="trizen-body trizen-process-item trizen-process-item-delay-2 mt-5 max-w-lg">
            From checkout to your setup — four steps, zero friction.
          </p>
        </div>

        <div className="relative">
          <div
            className="trizen-process-track pointer-events-none absolute left-[8%] right-[8%] top-[3.25rem] hidden h-px lg:block"
            aria-hidden
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                className={[
                  "trizen-process-card trizen-process-item group relative flex flex-col border border-[var(--color-border)] bg-zinc-50/50 p-7 md:p-8 transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-50/80 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]",
                  i === 0 && "trizen-process-item-delay-2",
                  i === 1 && "trizen-process-item-delay-3",
                  i === 2 && "trizen-process-item-delay-4",
                  i === 3 && "trizen-process-item-delay-5",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="trizen-process-num relative z-[1] inline-flex h-14 w-14 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-lg font-bold tabular-nums text-[var(--color-foreground)] transition-colors duration-500 group-hover:border-zinc-500">
                  {s.n}
                </span>
                <h3 className="relative z-[1] mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-foreground)]">
                  {s.title}
                </h3>
                <p className="trizen-body relative z-[1] mt-3 flex-1">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
