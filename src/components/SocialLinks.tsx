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
  iconClassName = "h-[22px] w-[22px]",
}: Props) {
  return (
    <div className={cn("flex items-center gap-0.5 sm:gap-1", className)}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center transition-opacity duration-300 hover:opacity-80",
            linkClassName
          )}
        >
          <span className={cn("relative block", iconClassName)}>
            <Image
              src={item.icon}
              alt=""
              fill
              sizes="22px"
              className="object-contain object-center"
              aria-hidden
            />
          </span>
        </a>
      ))}
    </div>
  );
}
