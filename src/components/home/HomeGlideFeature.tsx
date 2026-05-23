import Image from "next/image";
import Link from "next/link";
import { GlideAnimatedTitle } from "@/components/home/GlideAnimatedTitle";
import { GlideEditionBridge } from "@/components/home/GlideEditionBridge";
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
  "group flex h-full min-h-[320px] sm:min-h-[360px] flex-col overflow-hidden transition-opacity duration-500 hover:opacity-90";

const editionLabelClass =
  "shrink-0 w-full text-center px-4 py-5 text-[11px] uppercase tracking-[0.28em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300";

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
    <div className="relative flex-1 w-full min-h-[260px] sm:min-h-[300px]">
      <div className="absolute inset-3 sm:inset-5 md:inset-6">
        <Image
          src={primarySrc}
          alt={primaryAlt}
          fill
          className="object-contain object-center transition-opacity duration-500 ease-out group-hover:opacity-0"
          sizes="(max-width: 768px) 90vw, 28vw"
        />
        <Image
          src={hoverSrc}
          alt={hoverAlt}
          fill
          className="object-contain object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          sizes="(max-width: 768px) 90vw, 28vw"
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
      <div className="relative flex-1 w-full min-h-[260px] sm:min-h-[300px]">
        <div className="absolute inset-3 sm:inset-5 md:inset-6">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 90vw, 42vw"
          />
        </div>
        <span className="absolute top-5 left-5 z-10 text-[10px] font-bold uppercase tracking-widest bg-white text-black px-2.5 py-1">
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
      <div className="relative flex-1 w-full min-h-[260px] sm:min-h-[300px]">
        <div className="absolute inset-3 sm:inset-5 md:inset-6">
          <Image
            src={HOME_GLIDE_TRIPAD_IMAGE}
            alt="TriZen TriPad V1 black and white editions"
            fill
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 90vw, 45vw"
          />
        </div>
      </div>
      <p className={editionLabelClass}>TriPad V1</p>
    </Link>
  );
}

function GlideActionBanner() {
  return (
    <div className="relative min-h-[52vh] md:min-h-[58vh] overflow-hidden bg-black border-b border-[var(--color-border)]">
      <Image
        src={HOME_GLIDE_IMAGE}
        alt="Mouse gliding at speed on TriZen glass surface"
        fill
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/90 to-transparent"
        aria-hidden
      />

      <div className="container-trizen relative z-10 flex min-h-[52vh] md:min-h-[58vh] items-end justify-center pb-12 md:pb-16">
        <div className="max-w-2xl w-full text-center text-white">
          <p className="text-[10px] uppercase tracking-[0.38em] text-white">
            Performance
          </p>
          <GlideAnimatedTitle />
          <p className="trizen-body mt-4 max-w-lg mx-auto text-center">
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
      <GlideEditionBridge />

      <div className="border-b border-[var(--color-border)]">
        <div className="container-trizen pt-10 pb-12 md:pt-14 md:pb-20">
          <p className="trizen-eyebrow mb-8 text-center md:mb-10">
            Choose your edition
          </p>
          <div className="mx-auto max-w-7xl border border-[var(--color-border)] shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)] grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-[var(--color-border)] divide-y sm:divide-y-0">
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
          </div>

          <div className="mt-20 md:mt-28">
            <p className="trizen-eyebrow text-center mb-2">Upcoming</p>
            <h3 className="text-center text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-8 md:mb-10">
              TriPad V2
            </h3>
            <p className="trizen-body text-center max-w-xl mx-auto mb-10 md:mb-12 -mt-4">
              Same glass glide you trust — refreshed vertical TriZen branding in
              black and white.
            </p>

            <div className="mx-auto max-w-6xl border border-[var(--color-border)] shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)] grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-[var(--color-border)] divide-y sm:divide-y-0">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
