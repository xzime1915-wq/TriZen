import Link from "next/link";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-trizen-full flex min-h-[44vh] flex-col items-center justify-center py-20 text-center sm:py-24 md:min-h-[50vh] md:py-28">
        <h2 className="trizen-display-title text-[clamp(1.75rem,4.5vw,3.25rem)]">
          Upgrade your desk
          <br />
          Upgrade your aim
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed text-zinc-900 sm:mt-7 md:text-base">
          Premium esports gear, shipped across Bangladesh
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3 sm:mt-11 sm:gap-4">
          <Link href="/shop" className="trizen-wh-ghost-btn">
            Shop now
          </Link>
          <Link href="/contact" className="trizen-wh-ghost-btn">
            Contact us
          </Link>
        </div>
      </div>

      <div className="trizen-wh-trust-bar border-t border-zinc-200 text-zinc-900">
        <span>4.8 ★★★★★</span>
        <span className="mx-2 opacity-40">|</span>
        Customers rate us highly on product quality
        <span className="mx-2 opacity-40">|</span>
        Verified
      </div>
    </section>
  );
}
