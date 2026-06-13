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
      {label ? <span className="trizen-box-label">{label}</span> : null}
      <input
        className={cn(
          "trizen-box-field normal-case tracking-normal text-sm placeholder:normal-case placeholder:tracking-normal",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}
