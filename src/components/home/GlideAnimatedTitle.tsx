"use client";

import { useEffect, useRef, useState } from "react";

const TITLE = "Engineered for glide";
const TYPE_MS = 50;

type Props = {
  className?: string;
};

function resetRun(setLength: (n: number) => void, setDone: (d: boolean) => void) {
  setLength(0);
  setDone(false);
}

export function GlideAnimatedTitle({ className = "" }: Props) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const wasInViewRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [length, setLength] = useState(0);
  const [done, setDone] = useState(false);
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
          resetRun(setLength, setDone);
          setRunId((id) => id + 1);
        } else if (!visible) {
          resetRun(setLength, setDone);
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
      setDone(true);
    }
  }, [inView, reduceMotion, runId]);

  useEffect(() => {
    if (reduceMotion || !inView) return;

    if (length >= TITLE.length) {
      setDone(true);
      return;
    }

    const id = window.setTimeout(() => setLength((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [length, reduceMotion, inView, runId]);

  const showText = inView;
  const typing = inView && !reduceMotion && !done && length < TITLE.length;
  const visible = !showText
    ? ""
    : reduceMotion || done
      ? TITLE
      : TITLE.slice(0, length);

  return (
    <h2
      ref={rootRef}
      className={`mt-3 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl lg:text-4xl ${className}`}
      aria-label={TITLE}
    >
      <span className="relative inline-block min-h-[1.2em] text-center">
        <span className="invisible block" aria-hidden>
          {TITLE}
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center whitespace-nowrap transition-opacity duration-300 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          {visible}
          {typing ? (
            <span
              className="glide-typewriter-cursor ml-0.5 inline-block font-light text-zinc-400"
              aria-hidden
            >
              |
            </span>
          ) : null}
        </span>
      </span>
    </h2>
  );
}
