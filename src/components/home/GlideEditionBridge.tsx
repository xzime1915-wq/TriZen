"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HOME_GLIDE_BRIDGE_IMAGE } from "@/lib/home-assets";

export function GlideEditionBridge() {
  const frameRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;

        if (visible && !wasInViewRef.current) {
          setInView(true);
          setRunId((id) => id + 1);
        } else if (!visible) {
          setInView(false);
        }

        wasInViewRef.current = visible;
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[var(--color-surface)]">
      <div
        ref={frameRef}
        className={`glide-bridge-frame relative w-full aspect-[1024/577] min-h-[200px] overflow-hidden bg-[var(--color-surface)] ${
          inView ? "glide-bridge-inview" : ""
        }`}
      >
        <Image
          src={HOME_GLIDE_BRIDGE_IMAGE}
          alt="TriZen TriPad V1 — ultimate esports solutions"
          fill
          className="glide-bridge-img object-cover object-[50%_42%] scale-100"
          sizes="100vw"
          quality={92}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-10 bg-gradient-to-b from-black/60 via-black/20 to-transparent sm:h-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-16 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/70 to-transparent sm:h-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_72%_50%,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[58%] max-w-[500px] bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:w-[52%]"
          aria-hidden
        />

        <div className="absolute inset-0 z-20 flex items-end pb-6 md:pb-10">
          <div className="container-trizen w-full">
            <div key={runId} className="glide-bridge-copy w-full max-w-md text-left">
              <h2 className="glide-bridge-metallic glide-bridge-item text-[1.35rem] font-bold uppercase leading-none tracking-tight md:text-4xl lg:text-[2.75rem]">
                TriPad V1
              </h2>
              <p className="glide-bridge-eyebrow glide-bridge-item glide-bridge-item-delay-1 mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-300 md:mt-2 md:text-[11px] md:tracking-[0.32em]">
                Ultimate esports solutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
