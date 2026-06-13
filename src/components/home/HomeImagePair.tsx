import Image from "next/image";
import { HOME_HERO_IMAGE } from "@/lib/home-assets";

export function HomeImagePair() {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="grid md:grid-cols-2 min-h-[50vh]">
        <div className="relative min-h-[320px] md:min-h-[50vh] md:border-r-0">
          <Image
            src={HOME_HERO_IMAGE}
            alt="TRIZEN TRIPAD setup"
            fill
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <p className="absolute bottom-8 left-8 text-[10px] tracking-[0.2em] text-zinc-500">
            TRIPAD V1
          </p>
        </div>
        <div className="relative min-h-[320px] md:min-h-[50vh]">
          <Image
            src="/products/tripad-v1-white.png"
            alt="TRIPAD white edition"
            fill
            className="object-contain object-center p-12"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <p className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            White edition
          </p>
        </div>
      </div>
    </section>
  );
}
