"use client";

import { FaqAccordion } from "@/components/FaqAccordion";
import { FaqAllProductsTitle } from "@/components/faq/FaqAllProductsTitle";
import { getProductFaqs } from "@/lib/faq-content";
import { isUpcoming } from "@/lib/product-status";
import { getShopGearLine } from "@/lib/shop-gears";

export function ProductFaqSection({
  productName,
  slug,
  category,
  tag,
}: {
  productName: string;
  slug: string;
  category: string;
  tag?: string | null;
}) {
  const gearLine = getShopGearLine(slug, productName, category);
  const items = getProductFaqs(productName, gearLine, isUpcoming(tag));

  return (
    <section className="w-full bg-white">
      <div className="product-page-pad mx-auto max-w-3xl py-12 sm:py-16 md:py-20">
        <FaqAllProductsTitle />
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
