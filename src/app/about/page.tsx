import Link from "next/link";
import { TrizenLogo } from "@/components/TrizenLogo";
import { PageHero } from "@/components/PageHero";

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <PageHero
        eyebrow="About"
        title="TRIZEN Store"
        description="Premium esports gear for players who care about glide, control, and consistency."
      />

      <section>
        <div className="container-trizen py-16 md:py-20 max-w-3xl">
          <div className="flex items-center gap-5 mb-12">
            <TrizenLogo variant="on-light" width={56} height={56} className="shrink-0" />
            <p className="trizen-body md:text-base">
              Designed for competitive play, from ranked queues to long practice
              sessions.
            </p>
          </div>
          <div className="space-y-6 trizen-body md:text-[0.9375rem]">
            <p>
              TRIZEN Store is dedicated to premium esports gear, glass mouse pads,
              hand sleeves, and mouse skates built for players who demand the fastest
              glide and most precise control.
            </p>
            <p>
              Every product is tuned for esports performance. Secure checkout, order
              tracking, and flexible payment across Bangladesh.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-trizen py-16 md:py-20">
          <p className="trizen-eyebrow mb-4">Our gear</p>
          <h2 className="trizen-headline text-2xl md:text-3xl mb-10">What we build</h2>
          <ul className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Glass mouse pads",
                body: "Ultra smooth surface tuned for competitive glide.",
              },
              {
                title: "Hand sleeves",
                body: "Comfort and control for long sessions.",
              },
              {
                title: "Mouse skates",
                body: "Precision replacements for competitive mice.",
              },
            ].map((item) => (
              <li key={item.title} className="trizen-panel p-6 trizen-card-hover">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="trizen-body mt-3">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Link href="/shop" className="trizen-btn-primary">
              Shop all products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
