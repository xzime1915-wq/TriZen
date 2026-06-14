import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ProductReviewsBlock({ children }: Props) {
  return (
    <section id="reviews">
      <div className="product-page-pad py-14 md:py-20">
        <h2 className="trizen-wh-section-label mb-8 md:mb-10">Customer reviews</h2>
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </div>
    </section>
  );
}
