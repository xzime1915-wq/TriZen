import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function CheckoutLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="checkout-label pt-1 text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)] sm:min-w-[180px] lg:min-w-[200px]">
      {children}
    </div>
  );
}

export function CheckoutRow({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="checkout-row flex flex-col gap-4 border-b border-[var(--color-border)] py-8 sm:flex-row sm:gap-10">
      <CheckoutLabel>{label}</CheckoutLabel>
      <div className="checkout-row-content min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function CheckoutInput({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
        {label}
        {props.required && <span className="text-red-400"> *</span>}
      </span>
      <input
        className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-white"
        {...props}
      />
    </label>
  );
}

export function CheckoutTextarea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
        {label}
      </span>
      <textarea
        className="min-h-[100px] w-full resize-y border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-white"
        {...props}
      />
    </label>
  );
}
