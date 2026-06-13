"use client";

import { TrizenBrandName } from "@/components/TrizenBrandName";
import { OurGearCardLink } from "@/components/OurGearCardLink";
import { OUR_GEARS } from "@/lib/our-gears";

export function HomeOurGears() {
  return (
    <section className="our-gears-section bg-white py-12 md:py-20 lg:py-24">
      <div className="container-trizen-full">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="trizen-display-title">Our Gears</h2>
          <p className="our-gears-subtitle mt-4">
            The full <TrizenBrandName className="inline-flex text-[10px] md:text-[11px]" /> lineup — glass pads, soft pads, skates, and sleeves.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:gap-6">
          {OUR_GEARS.map((gear) => (
            <OurGearCardLink key={gear.id} gear={gear} />
          ))}
        </div>
      </div>
    </section>
  );
}
