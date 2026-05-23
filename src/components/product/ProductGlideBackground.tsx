import Image from "next/image";
import { HOME_GLIDE_IMAGE } from "@/lib/home-assets";

/** Glide scene behind TriPad product shots (white/black editions). */
export function ProductGlideBackground() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-[45%] z-0" aria-hidden>
        <Image
          src={HOME_GLIDE_IMAGE}
          alt=""
          fill
          className="object-contain object-left mix-blend-screen opacity-80"
          sizes="(max-width: 1024px) 50vw, 400px"
          quality={90}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] z-[1] bg-gradient-to-t from-black via-black/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[48%] h-20 z-[1] bg-gradient-to-b from-black to-transparent"
        aria-hidden
      />
    </>
  );
}
