import Image from "next/image";
import Link from "next/link";
import { ProductHoverAction, type ProductHoverData } from "@/components/product/ProductHoverAction";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { shouldShowProductPrice } from "@/lib/product-status";
import { formatCurrency, cn } from "@/lib/utils";
import {
  HOME_GLIDE_TRIPAD_IMAGE,
  HOME_GLIDE_WHITE_IMAGE,
  HOME_GLIDE_BLACK_IMAGE,
} from "@/lib/home-assets";
import { EditionShowcaseV2Grid } from "@/components/home/EditionShowcaseV2Grid";

const V1_BLACK_SLUG = "trizen-tripad-v1-black";
const V1_WHITE_SLUG = "trizen-tripad-v1-white";

const padImgClass = "edition-showcase-pad-img";

type ProductMap = Record<string, ProductHoverData | undefined>;

function ShowcaseHeader({ title }: { title: string }) {
  return (
    <div className="bg-white px-4 pb-4 pt-6 md:pb-8 md:pt-12">
      <h2 className="edition-showcase-title">{title}</h2>
    </div>
  );
}

function EditionMeta({
  label,
  product,
  mode,
}: {
  label: string;
  product?: ProductHoverData | null;
  mode: "default" | "shop";
}) {
  if (mode === "shop") {
    return (
      <div className="edition-showcase-cell-meta">
        <p className="edition-showcase-cell-label">{label}</p>
        {product && shouldShowProductPrice(product.tag) ? (
          <p className="edition-showcase-cell-price">{formatCurrency(product.price)}</p>
        ) : product ? (
          <p className="edition-showcase-cell-price">Price at launch</p>
        ) : null}
      </div>
    );
  }

  return (
    <span className="mt-2 text-center text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--color-foreground)] sm:mt-4 sm:text-[10px] sm:tracking-[0.34em] md:text-[11px] md:tracking-[0.38em]">
      {label}
    </span>
  );
}

function EditionCell({
  href,
  label,
  image,
  hoverImage,
  badge,
  product,
  mode = "default",
}: {
  href: string;
  label: string;
  image: { src: string; alt: string };
  hoverImage?: { src: string; alt: string };
  badge?: string;
  product?: ProductHoverData | null;
  mode?: "default" | "shop";
}) {
  const cellClass = cn(
    "group flex flex-col",
    mode === "shop"
      ? "edition-showcase-cell items-start"
      : "items-center px-1 py-2 sm:px-2 sm:py-3"
  );

  const visual = (
    <div className={cn("relative w-full", mode === "shop" && "edition-showcase-cell-visual")}>
      {badge && (
        <span className="absolute left-0 top-0 z-10 border border-[var(--color-border)] bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[var(--color-foreground)] sm:text-[10px]">
          {badge}
        </span>
      )}
      <Image
        src={displayImageSrc(image.src)}
        alt={image.alt}
        width={2400}
        height={1920}
        className={
          hoverImage
            ? `${padImgClass} transition-opacity duration-500 group-hover:opacity-0`
            : padImgClass
        }
        sizes="(max-width: 640px) 100vw, 33vw"
        quality={IMAGE_QUALITY}
        priority={label === "TriPad V1" || label === "TriPad V2"}
      />
      {hoverImage && (
        <Image
          src={displayImageSrc(hoverImage.src)}
          alt={hoverImage.alt}
          width={2400}
          height={1920}
          className={`${padImgClass} absolute inset-x-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          sizes="(max-width: 640px) 100vw, 33vw"
          quality={IMAGE_QUALITY}
        />
      )}
      {mode === "shop" && product ? <ProductHoverAction product={product} /> : null}
    </div>
  );

  if (mode === "shop") {
    return (
      <article className={cellClass}>
        <Link href={href} className="block w-full">
          {visual}
        </Link>
        <Link href={href} className="w-full">
          <EditionMeta label={label} product={product} mode={mode} />
        </Link>
      </article>
    );
  }

  return (
    <Link href={href} className={cellClass}>
      {visual}
      <EditionMeta label={label} product={product} mode={mode} />
    </Link>
  );
}

export function EditionShowcaseV1({
  mode = "default",
  productsBySlug,
}: {
  mode?: "default" | "shop";
  productsBySlug?: ProductMap;
}) {
  const black = productsBySlug?.[V1_BLACK_SLUG];
  const white = productsBySlug?.[V1_WHITE_SLUG];

  return (
    <div className="edition-showcase-section">
      {mode === "default" ? <ShowcaseHeader title="Choose your edition" /> : null}
      <div
        className={cn(
          "grid grid-cols-3 bg-white",
          mode === "shop"
            ? "edition-showcase-shop-grid"
            : "gap-4 px-2 pb-8 sm:gap-5 sm:px-4 md:gap-6 md:pb-12"
        )}
      >
        <EditionCell
          href={`/product/${V1_BLACK_SLUG}`}
          label="TriPad V1"
          mode={mode}
          image={{
            src: HOME_GLIDE_TRIPAD_IMAGE,
            alt: "TriZen TriPad V1 black and white editions",
          }}
        />
        <EditionCell
          href={`/product/${V1_WHITE_SLUG}`}
          label="White Edition"
          mode={mode}
          product={white}
          image={{
            src: HOME_GLIDE_WHITE_IMAGE,
            alt: "TriZen TriPad V1 white edition",
          }}
          hoverImage={{
            src: HOME_GLIDE_BLACK_IMAGE,
            alt: "TriZen TriPad V1 black edition",
          }}
        />
        <EditionCell
          href={`/product/${V1_BLACK_SLUG}`}
          label="Black Edition"
          mode={mode}
          product={black}
          image={{
            src: HOME_GLIDE_BLACK_IMAGE,
            alt: "TriZen TriPad V1 black edition",
          }}
          hoverImage={{
            src: HOME_GLIDE_WHITE_IMAGE,
            alt: "TriZen TriPad V1 white edition",
          }}
        />
      </div>
    </div>
  );
}

export function EditionShowcaseV2({
  productsBySlug,
  mode = "default",
}: {
  productsBySlug: Record<
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
  mode?: "default" | "shop";
}) {
  return (
    <div
      className={cn(
        "edition-showcase-section edition-showcase-v2",
        mode === "shop" ? "edition-showcase-v2--shop" : "mt-12 md:mt-20"
      )}
    >
      {mode === "shop" ? (
        <div className="edition-showcase-v2-shop-intro">
          <p className="edition-showcase-eyebrow">Coming soon</p>
          <h3 className="edition-showcase-v2-shop-title">TriPad V2</h3>
          <p className="edition-showcase-v2-shop-desc">
            Same glass glide you trust, with refreshed vertical TriZen branding in
            black and white.
          </p>
        </div>
      ) : (
        <div className="edition-showcase-v2-intro">
          <p className="edition-showcase-eyebrow">Coming soon</p>
          <h2 className="edition-showcase-v2-title">TriPad V2</h2>
          <p className="edition-showcase-v2-desc">
            Same glass glide you trust, with refreshed vertical TriZen branding in
            black and white.
          </p>
        </div>
      )}
      <EditionShowcaseV2Grid productsBySlug={productsBySlug} mode={mode} />
    </div>
  );
}
