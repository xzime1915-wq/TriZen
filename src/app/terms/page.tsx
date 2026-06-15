import { PageHero } from "@/components/PageHero";
import { SITE_CONTACT } from "@/lib/site-config";

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Terms for shopping at TRIZEN Store."
      />
      <section>
        <div className="container-trizen py-14 md:py-20 max-w-3xl space-y-6 trizen-body md:text-[0.9375rem]">
          <p>
            By placing an order on TRIZEN Store, you agree to these terms. Prices
            and availability are subject to change. We reserve the right to cancel
            orders in case of errors or stock issues.
          </p>
          <p>
            Payment must be completed as instructed at checkout. Delivery times
            vary by location within Bangladesh. Returns and refunds are handled
            according to our support policy. Contact us before sending items back.
          </p>
          <p>
            For order or product questions, email {SITE_CONTACT.email} or call
            {SITE_CONTACT.phoneDisplay}.
          </p>
        </div>
      </section>
    </div>
  );
}
