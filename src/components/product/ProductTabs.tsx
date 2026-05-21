"use client";

import { useState } from "react";
import type { ProductSpec } from "@/lib/product-data";
import { ProductFeaturesList } from "./ProductFeaturesList";

type Tab = "description" | "specifications" | "reviews";

export function ProductTabs({
  description,
  features,
  specifications,
  reviewsCount,
  reviewsPanel,
}: {
  description: string;
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

  return (
    <div
      id="product-details"
      className="border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
    >
      <div className="flex border-b border-[var(--color-border)] overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap border-t-2 transition ${
              tab === t.id
                ? "border-white text-white bg-black/40"
                : "border-transparent text-[var(--color-muted)] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-10">
        {tab === "description" && (
          <div className="max-w-3xl space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Product Description
              </h3>
              <div className="text-sm sm:text-base leading-relaxed text-[var(--color-muted)] whitespace-pre-wrap space-y-4">
                {description.split("\n\n").map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </div>
            {features.length > 0 && (
              <div className="pt-8 border-t border-[var(--color-border)]">
                <ProductFeaturesList features={features} title="Features" />
              </div>
            )}
          </div>
        )}

        {tab === "specifications" && (
          <div className="max-w-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              Technical Specifications
            </h3>
            {specifications.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                Specifications will be added soon.
              </p>
            ) : (
              <table className="w-full text-sm border border-[var(--color-border)]">
                <tbody>
                  {specifications.map((row, i) => (
                    <tr
                      key={row.label}
                      className={
                        i % 2 === 0
                          ? "bg-black/30"
                          : "bg-[var(--color-surface-elevated)]"
                      }
                    >
                      <th className="py-4 px-4 text-left font-semibold text-white w-[38%] border-b border-[var(--color-border)]">
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
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              Customer Reviews
            </h3>
            {reviewsPanel}
          </div>
        )}
      </div>
    </div>
  );
}
