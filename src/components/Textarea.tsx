import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
          {label}
        </span>
      )}
      <textarea
        className={cn(
          "w-full min-h-[100px] border border-[var(--color-border)] bg-black px-4 py-3 text-sm outline-none transition focus:border-white resize-y",
          className
        )}
        {...props}
      />
    </label>
  );
}
