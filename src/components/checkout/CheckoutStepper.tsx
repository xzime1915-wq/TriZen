const STEPS = ["Customer Details", "Review & Pay", "Confirmation"] as const;

export function CheckoutStepper({ active = 0 }: { active?: number }) {
  return (
    <div className="checkout-stepper mx-auto mb-10 max-w-3xl">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step} className="flex flex-1 flex-col items-center">
            <span
              className={`text-center text-xs font-medium uppercase tracking-wide sm:text-sm ${
                i <= active ? "text-white" : "text-[var(--color-muted)]"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-3 flex h-0.5 items-center">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--color-border)]" />
        <div
          className="absolute left-0 top-0 h-0.5 bg-white transition-all duration-300"
          style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="relative flex w-full justify-between">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full border-2 ${
                i <= active
                  ? "border-white bg-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
