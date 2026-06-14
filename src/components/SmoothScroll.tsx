"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HEADER_OFFSET = 64;

function scrollToHashTarget() {
  const hash = window.location.hash;

  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      const top =
        target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: "auto" });
      return;
    }
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

/** Native 1:1 scroll — no inertia or smooth lag after wheel stops. */
export function SmoothScroll() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToHashTarget);
    });
    const retry = window.setTimeout(scrollToHashTarget, 120);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [pathname, isAdmin]);

  return null;
}
