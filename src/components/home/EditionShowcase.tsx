import Image from "next/image";
import Link from "next/link";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import {
  HOME_GLIDE_TRIPAD_IMAGE,
  HOME_GLIDE_WHITE_IMAGE,
  HOME_GLIDE_BLACK_IMAGE,
} from "@/lib/home-assets";
import { EditionShowcaseV2Grid } from "@/components/home/EditionShowcaseV2Grid";

const V1_BLACK_SLUG = "trizen-tripad-v1-black";
const V1_WHITE_SLUG = "trizen-tripad-v1-white";

const padImgClass =
  "mx-auto block h-auto w-full max-h-[min(78vw,420px)] object-contain object-center sm:max-h-[min(46vh,520px)] lg:max-h-[min(50vh,580px)]";

function ShowcaseHeader({ title }: { title: string }) {
  return (
    <div className="bg-white px-4 pb-4 pt-6 md:pb-8 md:pt-12">
      <h2 className="edition-showcase-title">{title}</h2>
    </div>
  );
}

function EditionCell({
  href,
  label,
  image,
  hoverImage,
  badge,
}: {
  href: string;
  label: string;
  image: { src: string; alt: string };
  hoverImage?: { src: string; alt: string };
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center px-1 py-2 sm:px-2 sm:py-4"
    >
      <div className="relative w-full">
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
      </div>
      <span className="mt-2 text-center text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--color-foreground)] sm:mt-4 sm:text-[10px] sm:tracking-[0.34em] md:text-[11px] md:tracking-[0.38em]">
        {label}
      </span>
    </Link>
  );
}

export function EditionShowcaseV1() {
  return (
    <div className="edition-showcase-section">
      <ShowcaseHeader title="Choose your edition" />
      <div className="grid grid-cols-3 gap-2 bg-white px-3 pb-6 sm:gap-4 sm:px-4 md:gap-6 md:pb-10">
        <EditionCell
          href={`/product/${V1_BLACK_SLUG}`}
          label="TriPad V1"
          image={{
            src: HOME_GLIDE_TRIPAD_IMAGE,
            alt: "TriZen TriPad V1 black and white editions",
          }}
        />
        <EditionCell
          href={`/product/${V1_WHITE_SLUG}`}
          label="White Edition"
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

export function EditionShowcaseV2() {
  return (
    <div className="edition-showcase-section edition-showcase-v2 mt-12 md:mt-20">
      <div className="edition-showcase-v2-intro">
        <p className="edition-showcase-eyebrow">Coming soon</p>
        <h2 className="edition-showcase-v2-title">TriPad V2</h2>
        <p className="edition-showcase-v2-desc">
          Same glass glide you trust, with refreshed vertical TriZen branding in
          black and white.
        </p>
      </div>
      <EditionShowcaseV2Grid />
    </div>
  );
}
