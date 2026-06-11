import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function CheckoutInput({
  label,
  hideLabel = true,
  className,
  placeholder,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hideLabel?: boolean }) {
  const fieldPlaceholder =
    placeholder ?? (hideLabel ? `${label}${props.required ? " *" : ""}` : undefined);

  return (
    <label className={cn("block", className)}>
      {!hideLabel && (
        <span className="checkout-field-label">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <input
        className="checkout-field-input"
        placeholder={fieldPlaceholder}
        aria-label={hideLabel ? label : undefined}
        {...props}
      />
    </label>
  );
}

export function CheckoutTextarea({
  label,
  hideLabel = true,
  className,
  placeholder,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hideLabel?: boolean }) {
  const fieldPlaceholder = placeholder ?? (hideLabel ? label : undefined);

  return (
    <label className={cn("block", className)}>
      {!hideLabel && <span className="checkout-field-label">{label}</span>}
      <textarea
        className={cn("checkout-field-input min-h-[88px] resize-y")}
        placeholder={fieldPlaceholder}
        aria-label={hideLabel ? label : undefined}
        {...props}
      />
    </label>
  );
}

export function CheckoutSelect({
  label,
  hideLabel = true,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; hideLabel?: boolean }) {
  return (
    <label className={cn("block", className)}>
      {!hideLabel && (
        <span className="checkout-field-label">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <select
        className="checkout-field-input checkout-field-select"
        aria-label={hideLabel ? label : undefined}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function CheckoutSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="checkout-section">
      <div className="checkout-section-head">
        <h2 className="checkout-section-title">{title}</h2>
        {subtitle ? <p className="checkout-section-subtitle">{subtitle}</p> : null}
      </div>
      <div className="checkout-section-body">{children}</div>
    </section>
  );
}
