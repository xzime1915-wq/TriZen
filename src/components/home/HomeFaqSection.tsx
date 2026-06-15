"use client";

import { useState } from "react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FaqAllProductsTitle } from "@/components/faq/FaqAllProductsTitle";
import {
  HOME_FAQS,
  HOME_SEO_PARAGRAPHS,
  HOME_SEO_TITLE,
} from "@/lib/faq-content";

export function HomeFaqSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="home-faq-section bg-[var(--color-surface)]">
      <div className="container-trizen mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-20 lg:py-24">
        <h2 className="trizen-display-title home-faq-seo-title mb-6 md:mb-10">
          {HOME_SEO_TITLE}
        </h2>

        <div className="home-faq-seo-copy relative mt-2 md:mt-4">
          <div
            className={`space-y-4 text-center font-light leading-relaxed text-zinc-900 ${
              expanded ? "" : "max-h-[7.5rem] sm:max-h-[13rem] overflow-hidden"
            }`}
          >
            {HOME_SEO_PARAGRAPHS.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
          {!expanded ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/90 to-transparent sm:h-24"
              aria-hidden
            />
          ) : null}
        </div>

        <div className="mt-5 text-center md:mt-6">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="trizen-btn-primary home-faq-see-more-btn"
          >
            {expanded ? "See less" : "See more"}
          </button>
        </div>

        <div className="mt-10 md:mt-16">
          <FaqAllProductsTitle className="home-faq-list-title">FAQ</FaqAllProductsTitle>
          <FaqAccordion items={HOME_FAQS} />
        </div>
      </div>
    </section>
  );
}
