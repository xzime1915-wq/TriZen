import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ProductReviewsBlock({ children }: Props) {
  return (
    <section id="reviews">
      <div className="product-page-pad py-14 md:py-20">
        <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-foreground)] md:mb-10">
          Reviews
        </h2>
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </div>
    </section>
  );
}
