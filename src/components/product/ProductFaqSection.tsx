"use client";

import { FaqAccordion } from "@/components/FaqAccordion";
import { getProductFaqs } from "@/lib/faq-content";
import { isUpcoming } from "@/lib/product-status";

export function ProductFaqSection({
  productName,
  tag,
}: {
  productName: string;
  tag?: string | null;
}) {
  const items = getProductFaqs(productName, isUpcoming(tag));

  return (
    <section className="w-full border-t border-[var(--color-border)] bg-black">
      <div className="product-page-pad py-12 sm:py-16 max-w-3xl mx-auto">
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
