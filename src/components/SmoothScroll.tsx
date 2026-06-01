"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import "lenis/dist/lenis.css";

/** Buttery page scroll (Lenis). Off on /admin and when user prefers reduced motion. */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.09,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.05,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      lenisRef.current?.resize();
    }
  }, [pathname]);

  return null;
}
