import Image from "next/image";
import { PAYMENT_LOGOS } from "@/lib/payment-logos";
import { cn } from "@/lib/utils";

export function PayWithLogos({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid w-full max-w-3xl grid-cols-8 items-center justify-items-center gap-0.5 sm:gap-2 md:gap-2.5",
        className
      )}
    >
      {PAYMENT_LOGOS.map((logo) => (
        <li key={logo.src} className="flex w-full min-w-0 items-center justify-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={88}
            height={36}
            className="trizen-pay-with-logo"
            sizes="(max-width: 639px) 11vw, 88px"
          />
        </li>
      ))}
    </ul>
  );
}
