import Image from "next/image";
import {
  Box,
  Layers,
  Package,
  Ruler,
  Scale,
  Shield,
  Sparkles,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProductSpec } from "@/lib/product-data";
import { displayImageSrc } from "@/lib/image-path";

function specIcon(label: string): LucideIcon {
  const key = label.toLowerCase();
  if (key.includes("dimension") || key.includes("size")) return Ruler;
  if (key.includes("thickness")) return Ruler;
  if (key.includes("weight")) return Scale;
  if (key.includes("material") || key.includes("surface")) return Layers;
  if (key.includes("base")) return Shield;
  if (key.includes("edition") || key.includes("series")) return Tag;
  if (key.includes("design") || key.includes("ideal")) return Sparkles;
  if (key.includes("product")) return Package;
  return Box;
}

type Props = {
  productName: string;
  specifications: ProductSpec[];
  featureImage?: string;
};

export function ProductSpecShowcase({
  productName,
  specifications,
  featureImage,
}: Props) {
  if (specifications.length === 0) return null;

  return (
    <section id="product-details">
      <div className="product-page-pad py-14 md:py-20 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-16 xl:gap-20">
          <div className="min-w-0">
            <h2 className="product-spec-headline">{productName}</h2>
            <dl className="mt-8 md:mt-10">
              {specifications.map((spec) => {
                const Icon = specIcon(spec.label);
                return (
                  <div
                    key={spec.label}
                    className="product-spec-row grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-x-6 gap-y-1 py-4 first:pt-0"
                  >
                    <dt className="trizen-wh-mono flex min-w-0 items-start gap-2.5 text-[9px] font-light uppercase tracking-[0.18em] text-zinc-900">
                      <Icon
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-900"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span>{spec.label}</span>
                    </dt>
                    <dd className="text-right text-sm font-light leading-snug text-zinc-900 normal-case md:text-base">
                      {spec.value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {featureImage ? (
            <div className="product-spec-visual relative w-full lg:min-h-full">
              <div className="product-spec-visual-frame relative aspect-square w-full sm:aspect-[5/6] lg:absolute lg:inset-0 lg:aspect-auto">
                <Image
                  src={displayImageSrc(featureImage)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-contain object-center"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
