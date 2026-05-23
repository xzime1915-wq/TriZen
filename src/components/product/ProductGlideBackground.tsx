import Image from "next/image";
import { HOME_GLIDE_IMAGE } from "@/lib/home-assets";

/** Glide scene behind TriPad product shots (white/black editions). */
export function ProductGlideBackground() {
  return (
    <>
      <div
        className="absolute -bottom-[14%] left-0 z-0 h-[58%] w-[175%] max-w-none sm:-bottom-[15%] sm:h-[62%] sm:w-[185%] md:w-[195%]"
        aria-hidden
      >
        <Image
          src={HOME_GLIDE_IMAGE}
          alt=""
          fill
          className="object-contain object-left mix-blend-screen opacity-80"
          sizes="(max-width: 1024px) 85vw, 720px"
          quality={90}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[42%] bg-gradient-to-b from-black via-black/70 via-40% to-transparent"
          aria-hidden
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] z-[1] bg-gradient-to-t from-black via-black/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[34%] z-[1] h-[28%] bg-gradient-to-b from-black via-black/60 to-transparent"
        aria-hidden
      />
    </>
  );
}
