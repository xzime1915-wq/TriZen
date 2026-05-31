"use client";

import Image from "next/image";
import { getLogoSrc, type LogoVariant } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

type AnimatedLogoProps = {
  size?: "sm" | "hero";
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
};

export function AnimatedLogo({
  size = "hero",
  variant = "on-light",
  className,
  priority = false,
}: AnimatedLogoProps) {
  if (size === "sm") {
    return (
      <Image
        src={getLogoSrc(variant)}
        alt="TriZen Store"
        width={40}
        height={40}
        className={cn("logo-intro-sm h-10 w-10 object-contain", className)}
      />
    );
  }

  return (
    <div className={cn("logo-intro-hero relative flex justify-center w-full", className)}>
      <div className="logo-intro-glow pointer-events-none" aria-hidden />
      <Image
        src="/intro-banner.png"
        alt="TriZen — Ultimate Esports Solutions"
        width={960}
        height={540}
        priority={priority}
        className="logo-intro-reveal relative z-10 w-full max-w-lg lg:max-w-2xl h-auto"
      />
      <span className="logo-intro-shine pointer-events-none" aria-hidden />
    </div>
  );
}
