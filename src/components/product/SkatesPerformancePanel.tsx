"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BARS = [
  { label: "Control", value: 100 },
  { label: "Speed", value: 50 },
  { label: "Durability", value: 80 },
] as const;

const BAR_DURATION = 1100;
const BAR_STAGGER = 160;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, active };
}

export function SkatesPerformancePanel({
  skateImage = "/products/trizen-ptfe-mouse-skates-single.webp",
}: {
  skateImage?: string;
}) {
  const { ref: barsRef, active } = useInViewOnce<HTMLUListElement>();
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (!active) return;

    const nodes = valueRefs.current;
    let frame = 0;
    const startedAt = performance.now();
    const lastShown = [-1, -1, -1];
    const total = BAR_DURATION + BAR_STAGGER * (BARS.length - 1);

    const tick = (now: number) => {
      const elapsed = now - startedAt;

      for (let i = 0; i < BARS.length; i += 1) {
        const local = Math.min(
          Math.max(elapsed - i * BAR_STAGGER, 0) / BAR_DURATION,
          1,
        );
        const value = Math.round(BARS[i].value * easeOutCubic(local));
        if (value === lastShown[i]) continue;
        lastShown[i] = value;
        const node = nodes[i];
        if (node) node.textContent = `${value}%`;
      }

      if (elapsed < total) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  return (
    <section className="skates-panel" aria-label="PTFE mouse skate performance">
      <div className="skates-panel-inner">
        <div className="skates-panel-row">
          <div className="skates-panel-tags">
            <span>PTFE</span>
            <span>DOT</span>
          </div>

          <div className="skates-panel-visual">
            <Image
              src={skateImage}
              alt="TRIZEN PTFE mouse skate dot"
              width={640}
              height={640}
              className="skates-panel-dot-image"
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "none",
                objectFit: "contain",
                transform: "scale(2.2)",
                transformOrigin: "center center",
              }}
            />
          </div>

          <ul
            ref={barsRef}
            className={active ? "skates-panel-bars is-active" : "skates-panel-bars"}
          >
            {BARS.map((bar, index) => (
              <li key={bar.label}>
                <div className="skates-panel-bar-track">
                  <div
                    className="skates-panel-bar-fill"
                    style={{
                      width: active ? `${bar.value}%` : "0%",
                      transitionDelay: `${index * BAR_STAGGER}ms`,
                    }}
                  >
                    <span>{bar.label}</span>
                  </div>
                </div>
                <span
                  ref={(node) => {
                    valueRefs.current[index] = node;
                  }}
                  className="skates-panel-bar-value"
                >
                  0%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
