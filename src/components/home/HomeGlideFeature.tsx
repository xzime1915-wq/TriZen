import Image from "next/image";
import { GlideAnimatedTitle } from "@/components/home/GlideAnimatedTitle";
import { HOME_GLIDE_IMAGE } from "@/lib/home-assets";
import { IMAGE_QUALITY } from "@/lib/image-quality";

function GlideActionBanner() {
  return (
    <div className="relative min-h-[30vh] sm:min-h-[40vh] md:min-h-[58vh] overflow-hidden bg-black">
      <Image
        src={HOME_GLIDE_IMAGE}
        alt="Mouse gliding at speed on TRIZEN glass surface"
        fill
        sizes="100vw"
        quality={IMAGE_QUALITY}
        className="object-cover object-center"
      />

      <div className="glide-banner-overlay" aria-hidden />

      <div className="container-trizen-full relative z-10 flex min-h-[30vh] items-end sm:min-h-[40vh] md:min-h-[58vh] md:px-0">
        <div className="glide-performance-block w-full max-w-lg px-4 pb-6 sm:pb-8 md:pb-12">
          <p className="glide-performance-eyebrow">Performance</p>
          <GlideAnimatedTitle className="glide-performance-title" />
          <p className="glide-performance-body">
            Low-friction glass helps your mouse move freely while the pad stays
            planted, built for ranked play and long sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeGlideFeature() {
  return (
    <section className="overflow-x-clip bg-[var(--color-surface)]">
      <GlideActionBanner />
    </section>
  );
}
