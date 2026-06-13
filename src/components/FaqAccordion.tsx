"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/faq-content";

type Props = {
  items: FaqItem[];
  title?: string;
  className?: string;
  variant?: "default" | "wallhack";
};

export function FaqAccordion({
  items,
  title,
  className,
  variant = "wallhack",
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isWh = variant === "wallhack";

  return (
    <section className={cn("w-full", isWh && "trizen-faq-wh", className)}>
      {title ? (
        <h2 className="trizen-display-title mb-8 md:mb-10">{title}</h2>
      ) : null}

      <div
        className={cn(
          isWh ? "trizen-faq-list" : "border-t border-[var(--color-border)]",
        )}
      >
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <div
              key={item.question}
              className={cn(
                "trizen-faq-item",
                isWh
                  ? "bg-transparent"
                  : "border-b border-[var(--color-border)] bg-zinc-50/50"
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className={cn(
                  "trizen-faq-trigger flex w-full items-center justify-between gap-4 text-left transition-colors",
                  isWh
                    ? "px-0 py-5 text-sm font-light normal-case tracking-normal text-zinc-900 hover:text-zinc-900"
                    : "px-1 py-4 sm:py-5 hover:text-[var(--color-foreground)]"
                )}
                aria-expanded={open}
              >
                <span
                  className={cn(
                    isWh
                      ? ""
                      : "text-sm sm:text-base font-bold uppercase tracking-wide text-[var(--color-foreground)]"
                  )}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-zinc-900 transition-transform duration-300",
                    open && "rotate-180",
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
                  <p
                    className={cn(
                      isWh
                        ? "trizen-faq-answer pb-6 pr-10 text-sm font-light leading-relaxed text-zinc-900"
                        : "trizen-detail pb-5 pr-8 sm:text-[0.9375rem]"
                    )}
                  >
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
