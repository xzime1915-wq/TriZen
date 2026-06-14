import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldErrorProps = {
  error?: string | null;
  showError?: boolean;
};

function FieldError({ error, showError }: FieldErrorProps) {
  if (!showError || !error) return null;
  return <p className="checkout-field-error">{error}</p>;
}

export function CheckoutInput({
  label,
  hideLabel = true,
  className,
  placeholder,
  error,
  showError,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hideLabel?: boolean;
} & FieldErrorProps) {
  const fieldPlaceholder =
    placeholder ?? (hideLabel ? `${label}${props.required ? " *" : ""}` : undefined);
  const visibleError = showError && error;

  return (
    <label className={cn("block", className)}>
      {!hideLabel && (
        <span className="checkout-field-label">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <input
        className={cn(
          "checkout-field-input",
          visibleError && "checkout-field-input--invalid"
        )}
        placeholder={fieldPlaceholder}
        aria-label={hideLabel ? label : undefined}
        aria-invalid={visibleError ? true : undefined}
        {...props}
      />
      <FieldError error={error} showError={showError} />
    </label>
  );
}

export function CheckoutTextarea({
  label,
  hideLabel = true,
  className,
  placeholder,
  error,
  showError,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hideLabel?: boolean;
} & FieldErrorProps) {
  const fieldPlaceholder = placeholder ?? (hideLabel ? label : undefined);
  const visibleError = showError && error;

  return (
    <label className={cn("block", className)}>
      {!hideLabel && <span className="checkout-field-label">{label}</span>}
      <textarea
        className={cn(
          "checkout-field-input min-h-[88px] resize-y",
          visibleError && "checkout-field-input--invalid"
        )}
        placeholder={fieldPlaceholder}
        aria-label={hideLabel ? label : undefined}
        aria-invalid={visibleError ? true : undefined}
        {...props}
      />
      <FieldError error={error} showError={showError} />
    </label>
  );
}

export function CheckoutSelect({
  label,
  hideLabel = true,
  children,
  className,
  error,
  showError,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hideLabel?: boolean;
} & FieldErrorProps) {
  const visibleError = showError && error;

  return (
    <label className={cn("block", className)}>
      {!hideLabel && (
        <span className="checkout-field-label">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <select
        className={cn(
          "checkout-field-input checkout-field-select",
          visibleError && "checkout-field-input--invalid"
        )}
        aria-label={hideLabel ? label : undefined}
        aria-invalid={visibleError ? true : undefined}
        {...props}
      >
        {children}
      </select>
      <FieldError error={error} showError={showError} />
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
