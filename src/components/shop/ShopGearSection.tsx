import Link from "next/link";
import { ShopProductCard } from "./ShopProductCard";
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
    "Engineered for maximum glide and control. The TRIPAD glass surface delivers pro-level speed.",
  "soft-mouse-pad":
    "Soft-touch cloth surface with precise control for every play style.",
  skates: "Low-friction mouse skates built for smooth, consistent movement.",
  "hand-sleeves": "Compression sleeves that reduce friction and keep you focused.",
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
          <p className="py-10 text-center trizen-wh-hero-eyebrow text-zinc-500 md:py-14">
            Products launching soon
          </p>
        )}
      </div>
      </div>
    </section>
  );
}
