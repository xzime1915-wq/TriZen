"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import "lenis/dist/lenis.css";

const HEADER_OFFSET = 64;

function shouldUseSmoothScroll() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Phones/tablets: native scroll. Desktop + trackpad/mouse: Lenis like Wallhack.
  return !window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** Wallhack-style weighted wheel scroll on desktop; native touch scroll on phones. */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin || !shouldUseSmoothScroll()) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.18,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.3,
      touchMultiplier: 1,
      anchors: { offset: HEADER_OFFSET },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = lenis;

    function onScrollLock(event: Event) {
      const locked = Boolean((event as CustomEvent<boolean>).detail);
      if (locked) lenis.stop();
      else lenis.start();
    }

    window.addEventListener("trizen:scroll-lock", onScrollLock);

    return () => {
      window.removeEventListener("trizen:scroll-lock", onScrollLock);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdmin]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || isAdmin) return;

    lenis.scrollTo(0, { immediate: true });
    const frame = requestAnimationFrame(() => lenis.resize());
    return () => cancelAnimationFrame(frame);
  }, [pathname, isAdmin]);

  return null;
}
