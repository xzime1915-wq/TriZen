"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <PageHero
        eyebrow="Support"
        title="Contact us"
        description="Questions about TRIPAD, orders, or shipping, we're here to help."
      />

      <div className="container-trizen py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <p className="trizen-eyebrow">Reach us</p>
            {[
              { icon: Mail, label: "Email", value: "support@trizenstore.com" },
              { icon: Phone, label: "Phone", value: "01778741431" },
              {
                icon: MapPin,
                label: "Location",
                value: "Bangladesh, nationwide shipping",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="trizen-panel flex gap-5 p-6 transition-colors duration-300 hover:border-zinc-600"
              >
                <Icon className="h-5 w-5 shrink-0 mt-0.5 text-zinc-400" />
                <div>
                  <p className="trizen-eyebrow text-zinc-600">{label}</p>
                  <p className="mt-2 text-sm text-[var(--color-foreground)]">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {sent ? (
            <div className="trizen-panel flex flex-col items-center justify-center p-10 md:p-12 text-center border-emerald-900/40 bg-emerald-950/20">
              <p className="text-lg font-bold uppercase tracking-wide text-[var(--color-foreground)] mb-2">
                Message sent
              </p>
              <p className="trizen-body">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="trizen-panel space-y-5 p-8 md:p-10"
            >
              <p className="trizen-eyebrow mb-2">Send a message</p>
              <Input label="Name" required />
              <Input label="Email" type="email" required />
              <Textarea label="Message" required />
              <Button type="submit" className="w-full" size="lg">
                Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
