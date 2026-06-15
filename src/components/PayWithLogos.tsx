import Image from "next/image";
import { PAYMENT_LOGOS } from "@/lib/payment-logos";
import { cn } from "@/lib/utils";

/** All payment logos in one horizontal row — shrink to fit mobile, no scroll. */
export function PayWithLogos({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex w-full flex-nowrap items-center justify-between gap-0.5 sm:justify-center sm:gap-2 md:gap-2.5",
        className
      )}
    >
      {PAYMENT_LOGOS.map((logo) => (
        <li key={logo.src} className="trizen-pay-with-slot shrink-0">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={88}
            height={36}
            className="trizen-pay-with-logo"
            sizes="52px"
          />
        </li>
      ))}
    </ul>
  );
}
