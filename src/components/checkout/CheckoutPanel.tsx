import { cn } from "@/lib/utils";

type Props = {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function CheckoutPanel({ step, title, description, children, className }: Props) {
  return (
    <section
      className={cn(
        "checkout-panel checkout-panel-light rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-6 md:p-7",
        className
      )}
    >
      <header className="checkout-panel-header mb-5 flex items-start gap-4 border-b border-[var(--color-border)] pb-4">
        <span className="checkout-panel-step flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black text-xs font-bold tracking-wider text-white">
          {step}
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-foreground)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">{description}</p>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}
