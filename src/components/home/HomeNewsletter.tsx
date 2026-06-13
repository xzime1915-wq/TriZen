import { NewsletterForm } from "@/components/NewsletterForm";
import { Mail } from "lucide-react";

export function HomeNewsletter() {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="container-trizen py-16 md:py-24 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="mx-auto mb-6 h-8 w-8 text-zinc-900" strokeWidth={1.25} />
          <h2 className="faq-all-products-title text-2xl sm:text-3xl md:text-4xl">
            Subscribe to our newsletter
          </h2>
          <div className="mt-8">
            <NewsletterForm variant="section" />
          </div>
        </div>
      </div>
    </section>
  );
}
