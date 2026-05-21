import Link from "next/link";

export function ShopEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-32 md:py-40 text-center border border-[var(--color-border)] bg-zinc-950/50">
      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">No results</p>
      <h2 className="mt-4 text-xl font-bold uppercase tracking-tight text-white">
        Nothing found
      </h2>
      <p className="mt-3 text-sm text-zinc-500 max-w-sm">
        Try another category or clear your search.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex bg-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-zinc-200"
      >
        View all products
      </Link>
    </div>
  );
}
