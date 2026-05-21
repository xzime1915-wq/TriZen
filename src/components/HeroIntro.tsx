"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";

export function HeroIntro() {
  return (
    <section className="hero-mixed relative overflow-hidden border-b border-[var(--color-border)] min-h-[520px] md:min-h-[580px] lg:min-h-[640px]">
      {/* Banner background */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/intro-banner.png"
          alt=""
          fill
          priority
          className="hero-mixed-bg object-cover object-[65%_center] md:object-[70%_center] lg:object-right"
          sizes="100vw"
        />
        {/* Blend text area with banner */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20 md:via-black/75 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Intro glow + shine */}
      <div className="logo-intro-glow pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <span className="logo-intro-shine pointer-events-none absolute inset-0" aria-hidden />

      {/* Content mixed on top */}
      <div className="hero-mixed-content container-trizen relative z-10 flex flex-col justify-center min-h-[520px] md:min-h-[580px] lg:min-h-[640px] py-16 md:py-20">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-4 hero-mixed-item hero-mixed-delay-1">
            Premium Esports Gear
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 hero-mixed-item hero-mixed-delay-2">
            Built for
            <br />
            <span className="text-zinc-400">Competitive Play</span>
          </h1>
          <p className="text-[var(--color-muted)] text-base md:text-lg max-w-md mb-8 leading-relaxed hero-mixed-item hero-mixed-delay-3">
            Glass mouse pads, hand sleeves, and mouse skates — engineered for
            ultimate esports performance and super-fast glide.
          </p>
          <div className="flex flex-wrap gap-4 hero-mixed-item hero-mixed-delay-4">
            <Link href="/shop">
              <Button size="lg">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
