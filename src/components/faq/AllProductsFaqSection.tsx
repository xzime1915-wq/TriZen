"use client";

import { FaqAccordion } from "@/components/FaqAccordion";
import { FaqAllProductsTitle } from "@/components/faq/FaqAllProductsTitle";
import type { FaqItem } from "@/lib/faq-content";
import { ALL_PRODUCTS_FAQS } from "@/lib/faq-content";
import { cn } from "@/lib/utils";

type Props = {
  items?: FaqItem[];
  className?: string;
  innerClassName?: string;
};

export function AllProductsFaqSection({
  items = ALL_PRODUCTS_FAQS,
  className,
  innerClassName,
}: Props) {
  return (
    <section className={cn("bg-white", className)}>
      <div
        className={cn(
          "container-trizen-full mx-auto max-w-3xl py-14 md:py-20 lg:py-24",
          innerClassName,
        )}
      >
        <FaqAllProductsTitle />
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
