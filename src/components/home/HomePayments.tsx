export function HomePayments() {
  const methods = [
    { name: "Cash on Delivery", desc: "Pay when your order arrives" },
    { name: "bKash", desc: "Mobile payment, fast & easy" },
    { name: "Nagad", desc: "Secure digital payment" },
    { name: "Bank Transfer", desc: "Use order number as reference" },
  ];

  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="container-trizen py-20 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mb-4 text-center">
          Checkout
        </p>
        <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-tight text-[var(--color-foreground)] mb-14">
          Flexible payment
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {methods.map((m) => (
            <div
              key={m.name}
              className="border border-[var(--color-border)] bg-zinc-50/80 px-6 py-8 text-center"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-foreground)]">
                {m.name}
              </p>
              <p className="mt-3 text-xs text-zinc-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
