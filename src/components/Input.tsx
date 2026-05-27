import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

export function Input({
  className,
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
          {label}
        </span>
      )}
      <input
        className={cn(
          "w-full border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-zinc-400",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
