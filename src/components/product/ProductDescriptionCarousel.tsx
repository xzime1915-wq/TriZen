"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";

const SLIDE_ALTS: Record<string, string> = {
  "/products/tripad-3mm-feature.png":
    "Lighter and Thinner, Just 3mm for Superior Gaming Experience",
  "/products/tripad-scratch-proof.png":
    "Scratch Proof and Impact Resistant TRIPAD surface",
  "/products/tripad-anti-slip-base.png":
    "Stability Rubber Anti Slip Base, full molded rubber bottom",
};

function slideAlt(src: string) {
  return SLIDE_ALTS[src] || "TRIPAD product feature";
}

function padIndex(n: number, total: number) {
  return `${String(n + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

export function ProductDescriptionCarousel({
  slides,
  compact = false,
}: {
  slides: string[];
  compact?: boolean;
}) {
  const items = slides.filter(Boolean);
  if (items.length === 0) return null;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const index = Math.min(active, items.length - 1);

  function go(delta: number) {
    setActive((i) => (i + delta + items.length) % items.length);
  }

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  return (
    <div
      className={`trizen-desc-carousel ${compact ? "trizen-desc-carousel--compact" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="trizen-desc-carousel-header">
        <span className="trizen-desc-carousel-line" aria-hidden />
        <p className="trizen-eyebrow text-zinc-900 font-light">Product highlights</p>
        <span className="trizen-desc-carousel-line" aria-hidden />
      </div>

      <div className="trizen-desc-carousel-shell">
        <div className="trizen-desc-carousel-frame group">
          {items.map((src, i) => (
            <div
              key={src}
              className={`trizen-desc-carousel-slide ${
                i === index
                  ? "trizen-desc-carousel-slide-active"
                  : "trizen-desc-carousel-slide-inactive"
              }`}
              aria-hidden={i !== index}
            >
              <Image
                src={displayImageSrc(src)}
                alt={slideAlt(src)}
                fill
                className="trizen-desc-carousel-image"
                sizes={
                  compact
                    ? "(max-width: 640px) 85vw, 20rem"
                    : "(max-width: 768px) 90vw, 28rem"
                }
                quality={IMAGE_QUALITY}
                priority={i === 0}
              />
            </div>
          ))}

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="trizen-desc-carousel-nav left-2 sm:left-3"
                aria-label="Previous highlight"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="trizen-desc-carousel-nav right-2 sm:right-3"
                aria-label="Next highlight"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </>
          )}

          <span className="trizen-desc-carousel-counter" aria-live="polite">
            {padIndex(index, items.length)}
          </span>
        </div>
      </div>

      {items.length > 1 && (
        <div className="trizen-desc-carousel-thumbs">
          <p className="text-[10px] font-light uppercase tracking-[0.28em] text-zinc-900 mb-3 text-center">
            Browse highlights
          </p>
          <div
            className="flex justify-center gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Feature highlights"
            data-lenis-prevent-wheel
          >
            {items.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`View highlight ${i + 1}`}
                onClick={() => setActive(i)}
                className={`trizen-desc-thumb ${
                  i === index ? "trizen-desc-thumb-active" : ""
                }`}
              >
                <Image
                  src={displayImageSrc(src)}
                  alt=""
                  fill
                  className="trizen-desc-thumb-image"
                  sizes="80px"
                  quality={IMAGE_QUALITY}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
