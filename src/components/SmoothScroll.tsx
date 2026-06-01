"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import "lenis/dist/lenis.css";

/** Smooth wheel on desktop only; phones keep native scroll (no stick/lag). */
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

    // Touch devices: native scroll — Lenis syncTouch feels sticky on shop pages.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.matchMedia("(max-width: 1023px)").matches;
    if (coarsePointer || narrowViewport) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.14,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
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
