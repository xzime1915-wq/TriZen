import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Terms for shopping at TriZen Store."
      />
      <section className="border-b border-[var(--color-border)]">
        <div className="container-trizen py-14 md:py-20 max-w-3xl space-y-6 trizen-body md:text-[0.9375rem]">
          <p>
            By placing an order on TriZen Store, you agree to these terms. Prices
            and availability are subject to change. We reserve the right to cancel
            orders in case of errors or stock issues.
          </p>
          <p>
            Payment must be completed as instructed at checkout. Delivery times
            vary by location within Bangladesh. Returns and refunds are handled
            according to our support policy — contact us before sending items back.
          </p>
          <p>
            For order or product questions, email info@trizenstorebd.com or call
            01778741431.
          </p>
        </div>
      </section>
    </div>
  );
}
