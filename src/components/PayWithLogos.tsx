import Image from "next/image";
import { PAYMENT_LOGOS } from "@/lib/payment-logos";
import { cn } from "@/lib/utils";

export function PayWithLogos({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0",
        className
      )}
    >
      {PAYMENT_LOGOS.map((logo) => (
        <li key={logo.src} className="shrink-0">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={88}
            height={36}
            className="trizen-pay-with-logo"
            sizes="88px"
          />
        </li>
      ))}
    </ul>
  );
}
