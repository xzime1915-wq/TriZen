import Link from "next/link";
import { StarRating } from "@/components/product/StarRating";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  productName: string;
};

export function HomeReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="container-trizen py-20 md:py-28">
        <p className="trizen-eyebrow mb-4">Community</p>
        <h2 className="trizen-headline text-2xl md:text-3xl mb-14">
          What players say
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <blockquote
              key={r.id}
              className="trizen-card-hover border border-[var(--color-border)] bg-zinc-950/60 p-8 min-h-[220px] flex flex-col"
            >
              <StarRating value={r.rating} size="sm" />
              {r.title && (
                <p className="mt-4 text-sm font-semibold text-white">{r.title}</p>
              )}
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed flex-1 line-clamp-5">
                {r.body}
              </p>
              <footer className="mt-6 pt-6 border-t border-[var(--color-border)] text-xs text-zinc-600">
                <span className="text-zinc-400">{r.authorName}</span>
                <span className="mx-2">·</span>
                <span>{r.productName}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-12 text-center text-xs text-zinc-600">
          Ordered something?{" "}
          <Link href="/shop" className="text-zinc-400 hover:text-white underline">
            Leave a review on the product page
          </Link>
        </p>
      </div>
    </section>
  );
}
