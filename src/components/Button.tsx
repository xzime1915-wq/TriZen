import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "trizen-box-action",
        variant === "dark" && "trizen-box-action",
        variant === "secondary" && "trizen-box-action trizen-box-action--outline",
        variant === "ghost" &&
          "inline-flex items-center justify-center font-medium uppercase tracking-wider transition hover:bg-zinc-100 rounded-none",
        variant === "danger" &&
          "inline-flex items-center justify-center border border-red-600 bg-red-600 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-red-500 rounded-none",
        size === "sm" && (variant === "ghost" || variant === "danger" ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-[9px]"),
        size === "md" && (variant === "ghost" || variant === "danger" ? "px-6 py-3 text-sm" : ""),
        size === "lg" && (variant === "ghost" || variant === "danger" ? "px-8 py-4 text-sm" : "px-8 py-4"),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
