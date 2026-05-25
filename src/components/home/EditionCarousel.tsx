"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const AUTO_MS = 4500;

type Props = {
  children: ReactNode;
  desktopCols?: 2 | 3;
  className?: string;
};

export function EditionCarousel({
  children,
  desktopCols = 3,
  className,
}: Props) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (count <= 1) return;

    const mq = window.matchMedia("(min-width: 640px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const tick = () => {
      if (mq.matches || reduced.matches || pausedRef.current) return;
      setIndex((i) => (i + 1) % count);
    };

    const id = window.setInterval(tick, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count]);

  const shellClass = cn(
    "border border-[var(--color-border)] shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)]",
    className
  );

  const desktopGrid =
    desktopCols === 3
      ? "hidden sm:grid sm:grid-cols-3 sm:divide-x divide-[var(--color-border)]"
      : "hidden sm:grid sm:grid-cols-2 sm:divide-x divide-[var(--color-border)]";

  return (
    <>
      {/* Mobile — auto slideshow, one slide at a time */}
      <div
        className={cn(shellClass, "relative overflow-hidden sm:hidden")}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onTouchStart={(e) => {
          pausedRef.current = true;
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          window.setTimeout(() => {
            pausedRef.current = false;
          }, 3000);
          if (start == null) return;
          const end = e.changedTouches[0]?.clientX ?? start;
          const delta = end - start;
          if (Math.abs(delta) < 40) return;
          if (delta < 0) goNext();
          else goPrev();
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full shrink-0 border-[var(--color-border)] [&:not(:first-child)]:border-l"
            >
              {slide}
            </div>
          ))}
        </div>

        {count > 1 && (
          <div className="flex items-center justify-center gap-2 py-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-zinc-600 hover:bg-zinc-400"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop — all editions visible */}
      <div className={cn(shellClass, desktopGrid)}>{children}</div>
    </>
  );
}
