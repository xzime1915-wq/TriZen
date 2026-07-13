"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getScrollMetrics() {
  const root = document.documentElement;
  const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

  return { maxScroll, progress };
}

export function PageScrollIndicator() {
  const railRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    const metrics = getScrollMetrics();
    setProgress(metrics.progress);
    setVisible(metrics.maxScroll > 120);
  }, []);

  useEffect(() => {
    let frame = 0;
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    const observer = new ResizeObserver(requestUpdate);
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      observer.disconnect();
    };
  }, [update]);

  const scrollFromPointer = useCallback((clientY: number) => {
    const rail = railRef.current;
    if (!rail) return;

    const rect = rail.getBoundingClientRect();
    const nextProgress = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const { maxScroll } = getScrollMetrics();
    window.scrollTo({ top: maxScroll * nextProgress, behavior: "auto" });
  }, []);

  if (!visible) return null;

  return (
    <button
      ref={railRef}
      type="button"
      className="trizen-page-scroll-indicator"
      style={{ "--scroll-progress": progress } as React.CSSProperties}
      aria-label={`Page scroll position: ${Math.round(progress * 100)}%`}
      title={`${Math.round(progress * 100)}% of page`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        scrollFromPointer(event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          scrollFromPointer(event.clientY);
        }
      }}
    >
      <span className="trizen-page-scroll-indicator__ticks" aria-hidden="true" />
      <span className="trizen-page-scroll-indicator__position" aria-hidden="true" />
    </button>
  );
}
