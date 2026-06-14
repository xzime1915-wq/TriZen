"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  muted?: boolean;
};

export function OurGearCta({ label, muted }: Props) {
  return (
    <span
      className={cn("our-gear-card-cta", muted && "our-gear-card-cta--muted")}
    >
      <span className="our-gear-card-cta-label">{label}</span>
    </span>
  );
}
