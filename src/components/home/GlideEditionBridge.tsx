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
    <div className="relative w-full overflow-hidden bg-black border-b border-black">
      <div
        ref={frameRef}
        className={`glide-bridge-frame relative w-full aspect-[1024/577] min-h-[200px] max-h-[520px] overflow-hidden bg-black ${
          inView ? "glide-bridge-inview" : ""
        }`}
      >
        <Image
          src={HOME_GLIDE_BRIDGE_IMAGE}
          alt="TriZen TriPad V1 — ultimate esports solutions"
          fill
          className="glide-bridge-img object-cover object-center scale-[1.14]"
          sizes="100vw"
          quality={92}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[2.5%] min-h-[6px] bg-black"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[4%] min-h-[12px] bg-black"
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[52%] max-w-[500px] bg-gradient-to-r from-black/75 via-black/40 to-transparent"
          aria-hidden
        />

        <div className="container-trizen absolute inset-0 z-20 flex items-end pb-8 md:pb-10">
          <div
            key={runId}
            className="w-full max-w-md text-center md:text-left"
          >
            <p className="glide-bridge-eyebrow glide-bridge-item text-[11px] font-medium uppercase text-white">
              Ultimate esports solutions
            </p>
            <h2 className="glide-bridge-metallic glide-bridge-item glide-bridge-item-delay-1 mt-4 text-3xl font-bold uppercase tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-none">
              TriPad V1
            </h2>
            <div
              className="glide-bridge-line glide-bridge-item glide-bridge-item-delay-2 mx-auto mt-5 h-px w-16 md:mx-0"
              aria-hidden
            />
            <p className="glide-bridge-item glide-bridge-item-delay-3 mt-5 text-sm leading-relaxed text-zinc-300 md:text-[0.9375rem]">
              Black &amp; white glass editions — in stock and ready to ship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
