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
        "inline-flex items-center justify-center font-medium uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "px-4 py-2 text-xs",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-sm",
        (variant === "primary" || variant === "dark") &&
          "border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        variant === "secondary" &&
          "border border-[var(--color-border)] text-zinc-600 hover:border-zinc-400 hover:text-[var(--color-foreground)]",
        variant === "ghost" && "hover:bg-zinc-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
