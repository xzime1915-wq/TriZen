"use client";

import { useEffect, useRef, useState } from "react";

const TITLE = "Engineered for glide";
const TYPE_MS = 55;

type Props = {
  className?: string;
};

export function GlideAnimatedTitle({ className = "" }: Props) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const wasInViewRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [length, setLength] = useState(0);
  const [runId, setRunId] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);

        if (visible && !wasInViewRef.current) {
          setLength(0);
          setRunId((id) => id + 1);
        } else if (!visible) {
          setLength(0);
        }

        wasInViewRef.current = visible;
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setLength(TITLE.length);
      return;
    }
    if (length >= TITLE.length) return;

    const id = window.setTimeout(() => setLength((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [length, reduceMotion, inView, runId]);

  const visible = !inView
    ? ""
    : reduceMotion
      ? TITLE
      : TITLE.slice(0, length);

  return (
    <h2
      ref={rootRef}
      className={`font-black uppercase tracking-[-0.01em] text-[var(--color-foreground)] md:mt-3 md:text-4xl md:leading-[1.1] lg:text-5xl ${className}`}
      aria-label={TITLE}
    >
      <span className="relative inline-block min-h-[1.2em] max-w-full text-center">
        {/* Invisible full text reserves space so typing never shifts layout */}
        <span
          className="invisible mx-auto block whitespace-nowrap px-1 text-center text-[clamp(1rem,5.1vw,1.75rem)] leading-[1.15] sm:text-inherit"
          aria-hidden
        >
          {TITLE}
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center whitespace-nowrap px-1 text-center text-[clamp(1rem,5.1vw,1.75rem)] leading-[1.15] sm:text-inherit transition-opacity duration-300 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
        >
          {visible}
        </span>
      </span>
    </h2>
  );
}
