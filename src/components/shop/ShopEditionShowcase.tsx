import {
  EditionShowcaseV1,
  EditionShowcaseV2,
} from "@/components/home/EditionShowcase";
import { SHOP_GEAR_COPY } from "@/lib/shop-gears";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const GLASS_PAD_SLUGS = [
  "trizen-tripad-v1-black",
  "trizen-tripad-v1-white",
  "trizen-tripad-v2-black",
  "trizen-tripad-v2-white",
] as const;

const GEAR_DESCRIPTION =
  "Engineered for maximum glide and control. The TriPad glass surface delivers pro-level speed.";

export async function ShopEditionShowcase() {
  const products = await prisma.product.findMany({
    where: { slug: { in: [...GLASS_PAD_SLUGS] } },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      compareAt: true,
      image: true,
      stock: true,
      tag: true,
    },
  });

  const productsBySlug = Object.fromEntries(
    products.map((product) => [product.slug, product])
  ) as Record<
    string,
    {
      id: string;
      slug: string;
      name: string;
      price: number;
      compareAt: number | null;
      image: string;
      stock: number;
      tag: string | null;
    } | undefined
  >;

  const copy = SHOP_GEAR_COPY["glass-mouse-pad"];

  return (
    <section
      id="gear-glass-mouse-pad"
      className="shop-glass-showcase scroll-mt-28 bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="container-trizen-full">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-start sm:justify-between sm:gap-8 md:mb-14">
          <div className="min-w-0 max-w-2xl space-y-3">
            <h2 className="trizen-shop-title text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {copy.title}
            </h2>
            <p className="shop-glass-showcase-desc text-sm leading-relaxed md:text-[0.9375rem]">
              {GEAR_DESCRIPTION}
            </p>
          </div>

          <Link
            href="/shop?gear=glass-mouse-pad"
            className="trizen-wh-ghost-btn shrink-0 self-start"
          >
            {copy.statusLabel}
          </Link>
        </div>

        <EditionShowcaseV1 mode="shop" productsBySlug={productsBySlug} />
        <EditionShowcaseV2 mode="shop" productsBySlug={productsBySlug} />
      </div>
    </section>
  );
}
