import Image from "next/image";
import Link from "next/link";
import { GlideAnimatedTitle } from "@/components/home/GlideAnimatedTitle";
import { GlideEditionBridge } from "@/components/home/GlideEditionBridge";
import { EditionCarousel } from "@/components/home/EditionCarousel";
import {
  HOME_GLIDE_IMAGE,
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

const cellShell =
  "group flex h-full min-h-0 flex-col overflow-hidden transition-opacity duration-500 hover:opacity-90";

const editionLabelClass =
  "shrink-0 w-full text-center px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300 sm:px-4 sm:py-5 sm:text-[11px] sm:tracking-[0.28em]";

/** Mobile: tall pad, minimal inset. Desktop: grid cell flex growth */
const imageAreaClass =
  "relative w-full h-[min(72vw,340px)] sm:flex-1 sm:h-auto sm:min-h-[300px]";

const imageInsetClass = "absolute inset-3 sm:inset-5 md:inset-6";

function SwapImages({
  primarySrc,
  primaryAlt,
  hoverSrc,
  hoverAlt,
}: {
  primarySrc: string;
  primaryAlt: string;
  hoverSrc: string;
  hoverAlt: string;
}) {
  return (
    <div className={imageAreaClass}>
      <div className={imageInsetClass}>
        <Image
          src={primarySrc}
          alt={primaryAlt}
          fill
          unoptimized
          className="object-contain object-center transition-opacity duration-500 ease-out group-hover:opacity-0"
          sizes="(max-width: 639px) 100vw, 28vw"
        />
        <Image
          src={hoverSrc}
          alt={hoverAlt}
          fill
          unoptimized
          className="object-contain object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          sizes="(max-width: 639px) 100vw, 28vw"
        />
      </div>
    </div>
  );
}

function EditionSwapCard({
  primarySrc,
  primaryAlt,
  hoverSrc,
  hoverAlt,
  label,
  href,
}: {
  primarySrc: string;
  primaryAlt: string;
  hoverSrc: string;
  hoverAlt: string;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className={cellShell}>
      <SwapImages
        primarySrc={primarySrc}
        primaryAlt={primaryAlt}
        hoverSrc={hoverSrc}
        hoverAlt={hoverAlt}
      />
      <p className={editionLabelClass}>{label}</p>
    </Link>
  );
}

function UpcomingEditionCard({
  src,
  alt,
  label,
  href,
}: {
  src: string;
  alt: string;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className={cellShell}>
      <div className={imageAreaClass}>
        <div className={imageInsetClass}>
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 639px) 100vw, 42vw"
          />
        </div>
        <span className="absolute top-2 left-2 z-10 text-[8px] font-bold uppercase tracking-widest bg-white text-black px-1.5 py-0.5 sm:top-5 sm:left-5 sm:text-[10px] sm:px-2.5 sm:py-1">
          Upcoming
        </span>
      </div>
      <p className={editionLabelClass}>{label}</p>
    </Link>
  );
}

function TripadV1Card() {
  return (
    <Link href={`/product/${V1_BLACK_SLUG}`} className={cellShell}>
      <div className={imageAreaClass}>
        <div className={imageInsetClass}>
          <Image
            src={HOME_GLIDE_TRIPAD_IMAGE}
            alt="TriZen TriPad V1 black and white editions"
            fill
            unoptimized
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 639px) 100vw, 45vw"
          />
        </div>
      </div>
      <p className={editionLabelClass}>TriPad V1</p>
    </Link>
  );
}

function GlideActionBanner() {
  return (
    <div className="relative min-h-[40vh] sm:min-h-[44vh] md:min-h-[58vh] overflow-hidden bg-black">
      <Image
        src={HOME_GLIDE_IMAGE}
        alt="Mouse gliding at speed on TriZen glass surface"
        fill
        unoptimized
        className="object-cover object-center opacity-95"
        sizes="100vw"
        quality={90}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-black/85 via-black/35 to-transparent sm:h-24"
        aria-hidden
      />

      <div className="container-trizen relative z-10 flex min-h-[40vh] sm:min-h-[44vh] md:min-h-[58vh] items-end justify-center px-4 pb-7 sm:pb-8 md:px-0 md:pb-16">
        <div className="glide-performance-block max-w-2xl w-full text-center text-white">
          <p className="glide-performance-eyebrow text-[10px] uppercase tracking-[0.38em] text-white">
            Performance
          </p>
          <GlideAnimatedTitle className="glide-performance-title" />
          <p className="glide-performance-body mx-auto max-w-lg text-center text-zinc-400 md:mt-4 md:text-base md:leading-relaxed">
            Low-friction glass helps your mouse move freely while the pad stays
            planted — built for ranked play and long sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeGlideFeature() {
  return (
    <section className="bg-black">
      <GlideActionBanner />
      <div className="relative bg-black pt-12 sm:pt-16 md:pt-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-14 bg-gradient-to-b from-black/70 via-black/25 to-transparent sm:h-16 md:h-20"
          aria-hidden
        />
        <GlideEditionBridge />
      </div>

      <div className="relative bg-black">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-14 bg-gradient-to-b from-black/70 via-black/25 to-transparent sm:h-16 md:h-20"
          aria-hidden
        />
        <div className="container-trizen pt-5 pb-12 max-md:pt-6 md:pt-14 md:pb-20">
          <p className="trizen-eyebrow mb-4 text-center text-[9px] tracking-[0.22em] max-md:mb-4 max-md:text-[9px] md:mb-10 md:text-xs md:tracking-[0.32em]">
            Choose your edition
          </p>
          <EditionCarousel desktopCols={3} className="mx-auto max-w-7xl">
            <TripadV1Card />
            <EditionSwapCard
              primarySrc={HOME_GLIDE_WHITE_IMAGE}
              primaryAlt="TriZen TriPad V1 white edition"
              hoverSrc={HOME_GLIDE_BLACK_IMAGE}
              hoverAlt="TriZen TriPad V1 black edition"
              label="White edition"
              href={`/product/${V1_WHITE_SLUG}`}
            />
            <EditionSwapCard
              primarySrc={HOME_GLIDE_BLACK_IMAGE}
              primaryAlt="TriZen TriPad V1 black edition"
              hoverSrc={HOME_GLIDE_WHITE_IMAGE}
              hoverAlt="TriZen TriPad V1 white edition"
              label="Black edition"
              href={`/product/${V1_BLACK_SLUG}`}
            />
          </EditionCarousel>

          <div className="mt-20 md:mt-28">
            <p className="trizen-eyebrow text-center mb-2">Upcoming</p>
            <h3 className="text-center text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-8 md:mb-10">
              TriPad V2
            </h3>
            <p className="trizen-body text-center max-w-xl mx-auto mb-10 md:mb-12 -mt-4">
              Same glass glide you trust — refreshed vertical TriZen branding in
              black and white.
            </p>

            <EditionCarousel desktopCols={2} className="mx-auto max-w-6xl">
              <UpcomingEditionCard
                src={HOME_GLIDE_V2_BLACK_IMAGE}
                alt="TriZen TriPad V2 black edition"
                label="V2 Black — upcoming"
                href={`/product/${V2_BLACK_SLUG}`}
              />
              <UpcomingEditionCard
                src={HOME_GLIDE_V2_WHITE_IMAGE}
                alt="TriZen TriPad V2 white edition"
                label="V2 White — upcoming"
                href={`/product/${V2_WHITE_SLUG}`}
              />
            </EditionCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}
