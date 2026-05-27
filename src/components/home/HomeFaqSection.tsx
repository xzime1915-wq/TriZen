"use client";

import { useState } from "react";
import { FaqAccordion } from "@/components/FaqAccordion";
import {
  HOME_FAQS,
  HOME_SEO_PARAGRAPHS,
  HOME_SEO_SUBTITLE,
  HOME_SEO_TITLE,
} from "@/lib/faq-content";

export function HomeFaqSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-trizen py-14 md:py-20 lg:py-24 max-w-4xl mx-auto">
        <h2 className="trizen-headline text-center text-2xl sm:text-3xl md:text-4xl leading-tight">
          {HOME_SEO_TITLE}
        </h2>
        <p className="mt-6 text-center text-sm font-bold uppercase tracking-wide text-zinc-600 sm:text-base">
          {HOME_SEO_SUBTITLE}
        </p>

        <div className="relative mt-8 md:mt-10">
          <div
            className={`space-y-5 text-center text-sm leading-relaxed text-zinc-500 sm:text-base ${
              expanded ? "" : "max-h-[11rem] sm:max-h-[13rem] overflow-hidden"
            }`}
          >
            {HOME_SEO_PARAGRAPHS.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
          {!expanded && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/90 to-transparent"
              aria-hidden
            />
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="trizen-btn-primary !px-8 !py-2.5 text-[10px] !tracking-[0.2em]"
          >
            {expanded ? "See Less" : "See More"}
          </button>
        </div>

        <div className="mt-14 md:mt-16 pt-12 border-t border-[var(--color-border)]">
          <FaqAccordion items={HOME_FAQS} />
        </div>
      </div>
    </section>
  );
}
