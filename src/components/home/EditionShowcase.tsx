import Image from "next/image";
import Link from "next/link";
import {
  HOME_GLIDE_TRIPAD_IMAGE,
  HOME_GLIDE_WHITE_IMAGE,
  HOME_GLIDE_BLACK_IMAGE,
  HOME_GLIDE_V2_BLACK_IMAGE,
  HOME_GLIDE_V2_WHITE_IMAGE,
} from "@/lib/home-assets";

const V1_BLACK_SLUG = "trizen-tripad-v1-black";
const V1_WHITE_SLUG = "trizen-tripad-v1-white";
const V2_BLACK_SLUG = "trizen-tripad-v2-black";
const V2_WHITE_SLUG = "trizen-tripad-v2-white";

const padImgClass =
  "mx-auto block h-auto w-full max-h-[min(78vw,420px)] object-contain object-center sm:max-h-[min(46vh,520px)] lg:max-h-[min(50vh,580px)]";

function ShowcaseHeader({ title }: { title: string }) {
  return (
    <>
      <div className="edition-showcase-bar" aria-hidden />
      <div className="bg-white px-4 pb-6 pt-9 md:pb-8 md:pt-12">
        <h2 className="edition-showcase-title">{title}</h2>
      </div>
    </>
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
      className="group flex flex-col items-center bg-white px-2 py-5 sm:px-3 sm:py-6 md:px-4 md:py-8"
    >
      <div className="relative w-full">
        {badge && (
          <span className="absolute left-0 top-0 z-10 border border-[var(--color-border)] bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[var(--color-foreground)] sm:text-[10px]">
            {badge}
          </span>
        )}
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={960}
          unoptimized
          className={
            hoverImage
              ? `${padImgClass} transition-opacity duration-500 group-hover:opacity-0`
              : padImgClass
          }
          sizes="(max-width: 640px) 100vw, 33vw"
          priority={label === "TriPad V1"}
        />
        {hoverImage && (
          <Image
            src={hoverImage.src}
            alt={hoverImage.alt}
            width={1200}
            height={960}
            unoptimized
            className={`${padImgClass} absolute inset-x-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        )}
      </div>
      <span className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.34em] text-[var(--color-foreground)] sm:mt-4 md:text-[11px] md:tracking-[0.38em]">
        {label}
      </span>
    </Link>
  );
}

export function EditionShowcaseV1() {
  return (
    <div className="edition-showcase-section">
      <ShowcaseHeader title="Choose your edition" />
      <div className="grid border-y border-[var(--color-border)] bg-white sm:grid-cols-3 sm:divide-x sm:divide-[var(--color-border)]">
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
    <div className="edition-showcase-section mt-14 md:mt-24">
      <ShowcaseHeader title="Upcoming · TriPad V2" />
      <div className="border-b border-[var(--color-border)] bg-white px-4 pb-6 pt-6 md:pb-8">
        <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-zinc-500">
          Same glass glide you trust — refreshed vertical TriZen branding in black
          and white.
        </p>
      </div>
      <div className="grid border-y border-[var(--color-border)] bg-white sm:grid-cols-2 sm:divide-x sm:divide-[var(--color-border)]">
        <EditionCell
          href={`/product/${V2_BLACK_SLUG}`}
          label="V2 Black — upcoming"
          badge="Upcoming"
          image={{
            src: HOME_GLIDE_V2_BLACK_IMAGE,
            alt: "TriZen TriPad V2 black edition",
          }}
        />
        <EditionCell
          href={`/product/${V2_WHITE_SLUG}`}
          label="V2 White — upcoming"
          badge="Upcoming"
          image={{
            src: HOME_GLIDE_V2_WHITE_IMAGE,
            alt: "TriZen TriPad V2 white edition",
          }}
        />
      </div>
    </div>
  );
}
