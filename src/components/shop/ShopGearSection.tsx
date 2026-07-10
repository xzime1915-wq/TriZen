import Link from "next/link";
import { ShopProductCard } from "./ShopProductCard";
import { ShopGearEmptyState } from "./ShopGearEmptyState";
import { SHOP_GEAR_COPY } from "@/lib/shop-gears";
import type { ShopGearLine } from "@/lib/shop-gears";

type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  tag: string | null;
};

const GEAR_DESCRIPTIONS: Record<ShopGearLine, string> = {
  "glass-mouse-pad":
    "TRIPAD glass mouse pads in Bangladesh, engineered for maximum glide, low friction, FPS tracking and pro-level control.",
  "soft-mouse-pad":
    "Soft gaming mouse pads with a cloth surface for precise control, comfort and long ranked sessions.",
  skates:
    "Low-friction PTFE mouse skates in Bangladesh, built for smoother and more consistent mouse movement.",
  "hand-sleeves":
    "Gaming hand sleeves that reduce arm friction and help keep mouse movement smooth during long sessions.",
};

export function ShopGearSection({
  gear,
  products,
  showWhenEmpty = false,
  index = 0,
}: {
  gear: ShopGearLine;
  products: ShopProduct[];
  showWhenEmpty?: boolean;
  index?: number;
}) {
  if (products.length === 0 && !showWhenEmpty) return null;

  const copy = SHOP_GEAR_COPY[gear];
  const isGrabNow = copy.statusLabel.toLowerCase() === "grab now";

  return (
    <section
      id={`gear-${gear}`}
      className="relative scroll-mt-28 bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="container-trizen-full">
      <div className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0 max-w-2xl space-y-3">
            <h2 className="trizen-shop-title text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {copy.title}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500 md:text-[0.9375rem]">
              {GEAR_DESCRIPTIONS[gear]}
            </p>
          </div>

          {isGrabNow ? (
            <Link
              href={`/shop?gear=${gear}`}
              className="trizen-wh-hero-eyebrow shrink-0 self-start text-zinc-500 transition-colors hover:text-zinc-900"
            >
              {copy.statusLabel}
            </Link>
          ) : (
            <span className="trizen-wh-hero-eyebrow shrink-0 self-start text-zinc-400">
              {copy.statusLabel}
            </span>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {products.map((p) => (
              <ShopProductCard key={p.slug} product={p} compact />
            ))}
          </div>
        ) : (
          <ShopGearEmptyState gear={gear} title={copy.title} compact />
        )}
      </div>
      </div>
    </section>
  );
}
