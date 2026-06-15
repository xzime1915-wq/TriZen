import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
};

export function SocialLinks({
  className,
  linkClassName,
  iconClassName = "h-[22px]",
}: Props) {
  return (
    <div className={cn("trizen-social-links flex items-center", className)}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={cn(
            "trizen-social-link flex h-9 w-9 shrink-0 items-center justify-center transition-opacity duration-300 hover:opacity-80",
            linkClassName,
          )}
        >
          <Image
            src={item.icon}
            alt=""
            width={28}
            height={28}
            sizes="28px"
            className={cn(
              "trizen-social-icon block w-auto max-w-[1.85rem] object-contain object-center",
              item.iconClass,
              iconClassName,
            )}
            aria-hidden
          />
        </a>
      ))}
    </div>
  );
}
