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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link href={`/product/${slug}`} className="w-full sm:w-auto">
        <Button size="lg" className="w-full sm:min-w-[200px]">
          {upcoming ? "View product" : "Shop now"}
        </Button>
      </Link>
      <Link href="/shop" className="w-full sm:w-auto">
        <Button size="lg" variant="secondary" className="w-full sm:min-w-[200px]">
          View collection
        </Button>
      </Link>
    </div>
  );
}
