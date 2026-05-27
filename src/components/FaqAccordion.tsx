"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/faq-content";

type Props = {
  items: FaqItem[];
  title?: string;
  className?: string;
};

export function FaqAccordion({ items, title = "FAQs", className }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={cn("w-full", className)}>
      {title ? (
        <h2 className="trizen-headline text-center text-2xl sm:text-3xl mb-8 md:mb-10">
          {title}
        </h2>
      ) : null}

      <div className="border-t border-[var(--color-border)]">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <div
              key={item.question}
              className="border-b border-[var(--color-border)] bg-zinc-50/50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-4 sm:py-5 px-1 text-left transition-colors hover:text-[var(--color-foreground)]"
                aria-expanded={open}
              >
                <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-[var(--color-foreground)]">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300",
                    open && "rotate-180 text-[var(--color-foreground)]"
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 pr-8 text-sm sm:text-[0.9375rem] leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
