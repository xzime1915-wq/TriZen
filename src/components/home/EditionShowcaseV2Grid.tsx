"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductHoverAction, type ProductHoverData } from "@/components/product/ProductHoverAction";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { shouldShowProductPrice } from "@/lib/product-status";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TRIPAD_MODEL_NAMES } from "@/lib/product-catalog-content";
import {
  HOME_GLIDE_V2_TRIPAD_IMAGE,
  HOME_GLIDE_V2_BLACK_IMAGE,
  HOME_GLIDE_V2_WHITE_IMAGE,
} from "@/lib/home-assets";

const padImgClass = "edition-showcase-pad-img";

type CellProps = {
  href: string;
  label: string;
  product?: ProductHoverData | null;
  image: { src: string; alt: string };
  hoverImage?: { src: string; alt: string };
  mode?: "default" | "shop";
};

function EditionProductCell({
  href,
  label,
  product,
  image,
  hoverImage,
  mode = "default",
}: CellProps) {
  const cellClass = cn(
    "group flex flex-col",
    mode === "shop"
      ? "edition-showcase-cell items-start"
      : "items-center px-1 py-2 sm:px-2 sm:py-3"
  );

  const visual = (
    <div className={cn("relative w-full overflow-hidden", mode === "shop" && "edition-showcase-cell-visual")}>
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
        priority={label.startsWith("TP")}
      />
      {hoverImage ? (
        <Image
          src={displayImageSrc(hoverImage.src)}
          alt={hoverImage.alt}
          width={2400}
          height={1920}
          className={`${padImgClass} absolute inset-x-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          sizes="(max-width: 640px) 100vw, 33vw"
          quality={IMAGE_QUALITY}
        />
      ) : null}
      {product ? <ProductHoverAction product={product} /> : null}
    </div>
  );

  const meta =
    mode === "shop" ? (
      <div className="edition-showcase-cell-meta">
        <p className="edition-showcase-cell-label">{label}</p>
        {product && shouldShowProductPrice(product.tag) ? (
          <p className="edition-showcase-cell-price">{formatCurrency(product.price)}</p>
        ) : product ? (
          <p className="edition-showcase-cell-price">Price at launch</p>
        ) : null}
      </div>
    ) : (
      <span className="mt-2 text-center text-[7px] font-light normal-case tracking-[0.08em] text-black sm:mt-4 sm:text-[10px] md:text-[11px]">
        {label}
      </span>
    );

  if (mode === "shop") {
    return (
      <article className={cellClass}>
        <Link href={href} className="block w-full">
          {visual}
        </Link>
        <Link href={href} className="w-full">
          {meta}
        </Link>
      </article>
    );
  }

  return (
    <div className={cellClass}>
      <Link href={href} className="block w-full">
        {visual}
      </Link>
      <Link href={href} className="w-full">
        {meta}
      </Link>
    </div>
  );
}

const V2_BLACK_SLUG = "trizen-tripad-v2-black";
const V2_WHITE_SLUG = "trizen-tripad-v2-white";

type Props = {
  productsBySlug: Record<string, ProductHoverData | undefined>;
  mode?: "default" | "shop";
};

export function EditionShowcaseV2Grid({ productsBySlug, mode = "default" }: Props) {
  const black = productsBySlug[V2_BLACK_SLUG];
  const white = productsBySlug[V2_WHITE_SLUG];

  return (
    <div
      className={cn(
        "grid grid-cols-3 bg-white",
        mode === "shop"
          ? "edition-showcase-shop-grid edition-showcase-shop-grid--v2"
          : "gap-4 px-2 pb-10 sm:gap-5 sm:px-4 md:gap-6 md:pb-14"
      )}
    >
      <EditionProductCell
        href={`/product/${V2_BLACK_SLUG}`}
        label="TP - V2"
        product={black}
        mode={mode}
        image={{
          src: HOME_GLIDE_V2_TRIPAD_IMAGE,
          alt: "TriZen TriPad V2 black and silver editions",
        }}
      />
      <EditionProductCell
        href={`/product/${V2_WHITE_SLUG}`}
        label={white?.name ?? TRIPAD_MODEL_NAMES.v2White}
        product={white}
        mode={mode}
        image={{
          src: HOME_GLIDE_V2_WHITE_IMAGE,
          alt: "TriZen TriPad V2 white edition",
        }}
        hoverImage={{
          src: HOME_GLIDE_V2_BLACK_IMAGE,
          alt: "TriZen TriPad V2 black edition",
        }}
      />
      <EditionProductCell
        href={`/product/${V2_BLACK_SLUG}`}
        label={black?.name ?? TRIPAD_MODEL_NAMES.v2Black}
        product={black}
        mode={mode}
        image={{
          src: HOME_GLIDE_V2_BLACK_IMAGE,
          alt: "TriZen TriPad V2 black edition",
        }}
        hoverImage={{
          src: HOME_GLIDE_V2_WHITE_IMAGE,
          alt: "TriZen TriPad V2 white edition",
        }}
      />
    </div>
  );
}
