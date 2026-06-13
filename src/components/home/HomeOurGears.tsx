"use client";

import { TrizenBrandName } from "@/components/TrizenBrandName";
import { OurGearCardLink } from "@/components/OurGearCardLink";
import { OUR_GEARS } from "@/lib/our-gears";

export function HomeOurGears() {
  return (
    <section className="trizen-section-dark relative overflow-hidden bg-black">
      <div className="container-trizen relative py-12 md:py-20 lg:py-24">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="trizen-wh-section-title text-2xl text-white md:text-4xl lg:text-5xl">
            Our Gears
          </h2>
          <p className="trizen-wh-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-zinc-500 md:text-[11px]">
            The full <TrizenBrandName className="inline-flex text-[10px] md:text-[11px]" /> lineup — glass pads, soft pads, skates, and sleeves.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {OUR_GEARS.map((gear) => (
            <OurGearCardLink key={gear.id} gear={gear} />
          ))}
        </div>
      </div>
    </section>
  );
}
