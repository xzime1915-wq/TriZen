"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductNotifyButton } from "@/components/product/ProductNotifyButton";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import {
  HOME_GLIDE_V2_TRIPAD_IMAGE,
  HOME_GLIDE_V2_BLACK_IMAGE,
  HOME_GLIDE_V2_WHITE_IMAGE,
} from "@/lib/home-assets";

const padImgClass =
  "mx-auto block h-auto w-full max-h-[min(78vw,420px)] object-contain object-center sm:max-h-[min(46vh,520px)] lg:max-h-[min(50vh,580px)]";

type CellProps = {
  href: string;
  label: string;
  productSlug: string;
  productName: string;
  image: { src: string; alt: string };
  hoverImage?: { src: string; alt: string };
};

function EditionUpcomingCell({
  href,
  label,
  productSlug,
  productName,
  image,
  hoverImage,
}: CellProps) {
  return (
    <div className="flex flex-col items-center px-1 py-2 sm:px-2 sm:py-4">
      <Link href={href} className="group flex w-full flex-col items-center">
        <div className="relative w-full">
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
            priority={label === "TriPad V2"}
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
        </div>
        <span className="mt-2 text-center text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--color-foreground)] sm:mt-4 sm:text-[10px] sm:tracking-[0.34em] md:text-[11px] md:tracking-[0.38em]">
          {label}
        </span>
      </Link>

      <div className="mt-3 w-full max-w-[220px] sm:mt-4">
        <ProductNotifyButton
          productSlug={productSlug}
          productName={productName}
          variant="compact"
        />
      </div>
    </div>
  );
}

const V2_BLACK_SLUG = "trizen-tripad-v2-black";
const V2_WHITE_SLUG = "trizen-tripad-v2-white";

export function EditionShowcaseV2Grid() {
  return (
    <div className="grid grid-cols-3 gap-2 bg-white px-3 pb-8 sm:gap-4 sm:px-4 md:gap-8 md:pb-14">
      <EditionUpcomingCell
        href={`/product/${V2_BLACK_SLUG}`}
        label="TriPad V2"
        productSlug={V2_BLACK_SLUG}
        productName="TRIZEN TRIPAD V2"
        image={{
          src: HOME_GLIDE_V2_TRIPAD_IMAGE,
          alt: "TriZen TriPad V2 black and silver editions",
        }}
      />
      <EditionUpcomingCell
        href={`/product/${V2_WHITE_SLUG}`}
        label="White Edition"
        productSlug={V2_WHITE_SLUG}
        productName="TRIZEN TRIPAD V2 White"
        image={{
          src: HOME_GLIDE_V2_WHITE_IMAGE,
          alt: "TriZen TriPad V2 white edition",
        }}
        hoverImage={{
          src: HOME_GLIDE_V2_BLACK_IMAGE,
          alt: "TriZen TriPad V2 black edition",
        }}
      />
      <EditionUpcomingCell
        href={`/product/${V2_BLACK_SLUG}`}
        label="Black Edition"
        productSlug={V2_BLACK_SLUG}
        productName="TRIZEN TRIPAD V2 Black"
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
