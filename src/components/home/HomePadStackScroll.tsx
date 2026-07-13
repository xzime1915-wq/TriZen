"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

const PADS = [
  {
    src: "/products/tripad-v2-black.webp",
    alt: "TRIZEN TRIPAD V2 Black glass mouse pad",
    width: 3840,
    height: 3370,
    visualScale: 1.002,
  },
  {
    src: "/products/tripad-v2-white.webp",
    alt: "TRIZEN TRIPAD V2 White glass mouse pad",
    width: 3840,
    height: 3370,
    visualScale: 1,
  },
  {
    src: "/products/tripad-v1-white.webp",
    alt: "TRIZEN TRIPAD V1 White glass mouse pad",
    width: 3840,
    height: 3370,
    visualScale: 1.025,
  },
  {
    src: "/products/tripad-v1-black.webp",
    alt: "TRIZEN TRIPAD V1 Black glass mouse pad",
    width: 2400,
    height: 2106,
    visualScale: 1.016,
  },
] as const;

const INTRO_DURATION = 0.92;
const FIRST_PAD_START = 0.7;
const PAD_STEP = 0.9;
const PAD_DURATION = 1;
const TIMELINE_DURATION =
  FIRST_PAD_START + (PADS.length - 1) * PAD_STEP + PAD_DURATION;

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function HomePadStackScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;

    const render = () => {
      frame = 0;

      const section = sectionRef.current;
      if (!section) return;

      const prefersReducedMotion = reducedMotion.matches;
      const scrollDistance = Math.max(
        section.offsetHeight - window.innerHeight,
        1,
      );
      const sectionTop = section.getBoundingClientRect().top;
      const progress = prefersReducedMotion
        ? 0
        : clamp01(-sectionTop / scrollDistance);
      const timelineProgress = progress * TIMELINE_DURATION;
      const introPhase = prefersReducedMotion
        ? 0
        : smoothstep(clamp01(timelineProgress / INTRO_DURATION));
      const travel = window.innerHeight * 0.7;

      if (introRef.current) {
        introRef.current.style.opacity = clamp01(1 - introPhase).toFixed(3);
        introRef.current.style.transform = `translate3d(0, ${(
          window.innerHeight * -0.52 * introPhase
        ).toFixed(2)}px, 0)`;
        introRef.current.style.pointerEvents =
          introPhase < 0.72 ? "auto" : "none";
      }

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;

        const padStart = FIRST_PAD_START + index * PAD_STEP;
        const phase = prefersReducedMotion
          ? 0
          : easeOutCubic(
              clamp01((timelineProgress - padStart) / PAD_DURATION),
            );
        layer.style.transform = `translate3d(-50%, ${(
          -travel * phase
        ).toFixed(2)}px, 0)`;
      });
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    reducedMotion.addEventListener("change", requestRender);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotion.removeEventListener("change", requestRender);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="home-pad-stack-section"
      aria-labelledby="home-pad-stack-title"
    >
      <div className="home-pad-stack-sticky">
        <div className="home-pad-stack-intro-shell">
          <div ref={introRef} className="home-pad-stack-intro">
            <h1
              id="home-pad-stack-title"
              aria-label="Maximum glide for only pros"
              className="home-pad-stack-title home-hero-title trizen-wh-section-title"
            >
              <span className="home-pad-stack-title-line">Maximum glide</span>
              <span className="home-pad-stack-title-line">
                for only pr
                <span className="home-hero-letter-hollow">o</span>s
              </span>
            </h1>

            <div className="home-pad-stack-actions">
              <Link
                href="/product/trizen-tripad-v1-black"
                className="trizen-box-action home-hero-cta home-pad-stack-cta"
              >
                Shop TRIPAD
              </Link>
            </div>
          </div>
        </div>

        <p className="sr-only">
          Scroll to move the introduction up, then reveal four TRIZEN glass
          mouse pads one at a time.
        </p>

        <div className="home-pad-stack-stage">
          {PADS.map((pad, index) => (
            <div
              key={pad.src}
              ref={(node) => {
                layersRef.current[index] = node;
              }}
              className="home-pad-stack-layer"
              style={
                {
                  "--home-pad-offset": `${index * 5.7}svh`,
                  "--home-pad-visual-scale": pad.visualScale,
                  zIndex: index + 1,
                } as CSSProperties
              }
            >
              <Image
                src={pad.src}
                alt={pad.alt}
                width={pad.width}
                height={pad.height}
                sizes="(max-width: 767px) 94vw, (max-width: 1023px) 82vw, 72vw"
                className="home-pad-stack-image"
                priority={index === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
