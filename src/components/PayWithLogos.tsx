import Image from "next/image";
import { PAYMENT_LOGOS } from "@/lib/payment-logos";
import { cn } from "@/lib/utils";

export function PayWithLogos({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex max-w-full flex-nowrap items-center justify-center gap-1 min-w-0 overflow-x-auto sm:gap-2 md:gap-2.5",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
            sizes="(max-width: 639px) 36px, 88px"
          />
        </li>
      ))}
    </ul>
  );
}
