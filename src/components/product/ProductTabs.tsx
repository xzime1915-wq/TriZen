"use client";

import { useState } from "react";
import type { ProductSpec } from "@/lib/product-data";
import { ProductFeaturesList } from "./ProductFeaturesList";
import { ProductDescriptionCarousel } from "./ProductDescriptionCarousel";

type Tab = "description" | "specifications" | "reviews";

export function ProductTabs({
  productName,
  description,
  descriptionSlides,
  features,
  specifications,
  reviewsCount,
  reviewsPanel,
}: {
  productName: string;
  description: string;
  descriptionSlides?: string[];
  features: string[];
  specifications: ProductSpec[];
  reviewsCount: number;
  reviewsPanel: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: `Reviews (${reviewsCount})` },
  ];

  const slides = descriptionSlides ?? [];

  const paragraphs = description
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="product-details"
      className="w-full border-t border-[var(--color-border)]"
    >
      <nav
        className="flex w-full justify-center sm:justify-stretch flex-wrap gap-0 border-b border-[var(--color-border)] bg-zinc-50/30"
        aria-label="Product information"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`trizen-product-tab flex-1 sm:flex-initial sm:min-w-[10rem] ${
                active ? "trizen-product-tab-active" : ""
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div className="product-page-pad py-12 sm:py-16">
        {tab === "description" && (
          <div className="mx-auto w-full max-w-4xl flex flex-col items-center text-center">
            {slides.length > 0 && (
              <div className="w-full px-2 sm:px-0">
                <ProductDescriptionCarousel slides={slides} />
              </div>
            )}

            <h2
              className={`trizen-headline max-w-3xl text-[1rem] tracking-[0.06em] md:text-2xl ${
                slides.length > 0 ? "mt-14 sm:mt-16" : "mt-0"
              }`}
            >
              {productName}
            </h2>

            <div className="mt-6 max-w-2xl space-y-4 text-[0.75rem] leading-relaxed text-[var(--color-foreground)] md:mt-10 md:space-y-6 md:text-base">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            {features.length > 0 && (
              <div className="mt-14 sm:mt-16 w-full max-w-2xl pt-12 border-t border-[var(--color-border)] text-left">
                <ProductFeaturesList features={features} title="Features" />
              </div>
            )}
          </div>
        )}

        {tab === "specifications" && (
          <div className="mx-auto w-full max-w-2xl text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-foreground)] mb-8">
              Technical Specifications
            </h3>
            {specifications.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                Specifications will be added soon.
              </p>
            ) : (
              <table className="w-full text-sm border border-[var(--color-border)] text-left">
                <tbody>
                  {specifications.map((row, i) => (
                    <tr
                      key={row.label}
                      className={
                        i % 2 === 0
                          ? "bg-white/30"
                          : "bg-[var(--color-surface-elevated)]"
                      }
                    >
                      <th className="py-4 px-4 font-semibold text-[var(--color-foreground)] w-[38%] border-b border-[var(--color-border)]">
                        {row.label}
                      </th>
                      <td className="py-4 px-4 text-[var(--color-muted)] border-b border-[var(--color-border)]">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="mx-auto w-full max-w-3xl text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-foreground)] mb-8">
              Customer Reviews
            </h3>
            <div className="text-left">{reviewsPanel}</div>
          </div>
        )}
      </div>
    </section>
  );
}
