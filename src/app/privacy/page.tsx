import { PageHero } from "@/components/PageHero";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black min-h-screen">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How TriZen Store collects, uses, and protects your information."
      />
      <section className="border-b border-[var(--color-border)]">
        <div className="container-trizen py-14 md:py-20 max-w-3xl space-y-6 trizen-body md:text-[0.9375rem]">
          <p>
            TriZen Store respects your privacy. We collect only the information
            needed to process orders, provide support, and improve our services.
          </p>
          <p>
            Order details, contact information, and payment references are used
            solely for fulfillment and customer service. We do not sell your
            personal data to third parties.
          </p>
          <p>
            For questions about this policy, contact us at info@trizenstorebd.com.
          </p>
        </div>
      </section>
    </div>
  );
}
