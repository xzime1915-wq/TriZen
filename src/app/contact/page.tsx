"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SITE_CONTACT } from "@/lib/site-config";
import { Mail, Phone, MapPin } from "lucide-react";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONTACT.email,
    href: `mailto:${SITE_CONTACT.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE_CONTACT.phoneDisplay,
    href: `tel:${SITE_CONTACT.phone}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bangladesh, nationwide shipping",
  },
] as const;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Support"
        title="Contact us"
        description="Questions about TRIPAD, orders, or shipping — we're here to help."
      />

      <section>
        <div className="container-trizen py-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="trizen-wh-section-label mb-8">Reach us</h2>
              <div className="space-y-8">
                {CONTACT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const href = "href" in item ? item.href : undefined;
                  return (
                  <div key={item.label} className="flex gap-4">
                    <Icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-black"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="trizen-box-label text-zinc-500">{item.label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="trizen-body mt-2 block text-sm text-black transition-colors hover:text-zinc-600"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="trizen-body mt-2 text-sm text-black">{item.value}</p>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {sent ? (
              <div className="text-center lg:text-left">
                <p className="trizen-headline mb-2 text-xl">Message sent</p>
                <p className="trizen-body text-sm md:text-[0.9375rem]">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="trizen-wh-section-label mb-2">Send a message</h2>
                <Input label="Name" required />
                <Input label="Email" type="email" required />
                <Textarea label="Message" required />
                <Button type="submit" className="auth-wallhack-submit w-full" size="lg">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
