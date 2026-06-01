"use client";

import { useEffect, useRef } from "react";
import {
  HOME_HERO_IMAGE,
  HOME_HERO_IMAGE_FLIP_B,
} from "@/lib/home-assets";

const imgClass =
  "hero-coin-face-img h-full w-full object-contain object-center md:object-right";

/**
 * Coin flip: front = current hero (white bg + mouse), back = user’s black/silver shot.
 * Native <img> keeps 3D backface reliable (Next/Image wrappers can break it).
 */
export function HeroProductVisual() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = parallaxRef.current;
        if (!el) return;
        const offset = Math.min(window.scrollY * 0.14, 88);
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="hero-visual-stage relative w-full">
      <div ref={parallaxRef} className="hero-visual-parallax">
        <div className="hero-visual-glow" aria-hidden />
        <div className="hero-visual-coin-wrap relative aspect-[4/5] w-full sm:aspect-[16/12] md:aspect-[4/3] md:max-h-[min(68vh,560px)] lg:max-h-[min(72vh,620px)]">
          <div className="hero-coin-scene">
            <div className="hero-coin-flip">
              <div className="hero-coin-face hero-coin-face--front">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HOME_HERO_IMAGE}
                  alt="TriZen TriPad V1 black and white editions with gaming mouse"
                  className={imgClass}
                  width={2400}
                  height={2100}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <div className="hero-coin-face hero-coin-face--back">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HOME_HERO_IMAGE_FLIP_B}
                  alt="TriZen TriPad black and silver editions"
                  className={imgClass}
                  width={2400}
                  height={2100}
                  decoding="async"
                />
              </div>
            </div>
          </div>
          <span className="hero-visual-shine" aria-hidden />
        </div>
      </div>
    </div>
  );
}
