import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="container-trizen py-16 max-w-lg text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <Heart className="h-6 w-6 text-zinc-400" strokeWidth={1.5} />
      </div>
      <h1 className="trizen-headline text-2xl mb-3">Wishlist</h1>
      <p className="trizen-body text-sm mb-8">
        Save your favourite products here soon. For now, browse the shop and add
        items to your cart.
      </p>
      <Link href="/shop" className="trizen-btn-primary">
        Shop now
      </Link>
    </div>
  );
}
