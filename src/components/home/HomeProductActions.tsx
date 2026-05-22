import Link from "next/link";
import { Button } from "@/components/Button";
import { isUpcoming } from "@/lib/product-status";

type Props = {
  slug: string;
  tag?: string | null;
};

export function HomeProductActions({ slug, tag }: Props) {
  const upcoming = isUpcoming(tag);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/product/${slug}`} className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:min-w-[200px]">
            Shop now
          </Button>
        </Link>
        {upcoming && (
          <span className="inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-[var(--color-border)] px-4 py-3">
            Upcoming
          </span>
        )}
        <Link href="/shop" className="w-full sm:w-auto">
          <Button size="lg" variant="secondary" className="w-full">
            View collection
          </Button>
        </Link>
      </div>
    </div>
  );
}
