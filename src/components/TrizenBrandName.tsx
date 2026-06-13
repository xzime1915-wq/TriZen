import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  suffix?: string;
  suffixClassName?: string;
  vertical?: boolean;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
};

export function TrizenBrandName({
  className,
  style,
  suffix,
  suffixClassName,
  vertical = false,
  as: Tag = "span",
}: Props) {
  return (
    <Tag
      className={cn(
        "trizen-brand-name inline-flex items-baseline uppercase",
        suffix && "gap-[0.35em]",
        vertical && "trizen-brand-name--vertical",
        className
      )}
      style={style}
    >
      <span className="trizen-brand-t">T</span>
      <span className="trizen-brand-rest">RIZEN</span>
      {suffix ? (
        <span className={cn("trizen-brand-suffix", suffixClassName)}>{suffix}</span>
      ) : null}
    </Tag>
  );
}
