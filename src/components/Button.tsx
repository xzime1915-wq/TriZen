import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
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
        "inline-flex items-center justify-center font-medium uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" && "px-4 py-2 text-xs",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-sm",
        variant === "primary" &&
          "bg-white text-black hover:bg-zinc-100 hover:shadow-[0_0_32px_rgba(255,255,255,0.1)]",
        variant === "secondary" &&
          "border border-[var(--color-border)] text-zinc-300 hover:border-zinc-400 hover:text-white",
        variant === "ghost" && "hover:bg-zinc-900",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
