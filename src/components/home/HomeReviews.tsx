import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { StarRating } from "@/components/product/StarRating";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verified?: boolean;
  productName: string;
  productSlug: string;
  productImage: string;
  createdAt: string;
};

type Props = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function HomeReviews({ reviews, averageRating, totalReviews }: Props) {
  const hasReviews = totalReviews > 0;
  const thumbs = reviews.filter((review) => review.productImage);
  const listReviews = reviews.slice(0, 6);

  return (
    <section className="bg-white pb-12 md:pb-20 lg:pb-24">
      <div className="container-trizen-full">
        <h2 className="trizen-wh-section-label mb-6 md:mb-8">Customer reviews</h2>

        <div className="trizen-wh-reviews-bar">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <span className="trizen-wh-reviews-score">
              {hasReviews ? averageRating.toFixed(1) : "—"}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-light text-zinc-900">
                {totalReviews.toLocaleString()} verified review
                {totalReviews === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <Link href="/shop" className="trizen-wh-reviews-btn">
            Write a review
          </Link>
        </div>

        {thumbs.length > 0 ? (
          <div className="trizen-wh-review-thumb-row">
            {thumbs.map((review) => (
              <Link
                key={`thumb-${review.id}`}
                href={`/product/${review.productSlug}`}
                className="trizen-wh-review-thumb group"
                title={`${review.productName} — ${review.authorName}`}
              >
                <ProductImage
                  src={review.productImage}
                  alt={review.productName}
                  sizes="96px"
                  className="p-2 md:p-2.5"
                />
              </Link>
            ))}
          </div>
        ) : null}

        <div className="trizen-wh-reviews-toolbar">
          <p className="trizen-wh-reviews-count">
            Verified product reviews ({totalReviews.toLocaleString()})
          </p>
          <p className="trizen-wh-reviews-sort">Most helpful</p>
        </div>

        <div className="trizen-wh-review-list">
          {listReviews.length > 0 ? (
            listReviews.map((review) => (
              <article key={review.id} className="trizen-wh-review-item">
              <StarRating value={review.rating} size="sm" />

              <div className="trizen-wh-review-author-row">
                <span className="trizen-wh-review-author">{review.authorName}</span>
                {review.verified ? (
                  <span className="trizen-wh-review-verified">Verified</span>
                ) : null}
              </div>

              <p className="trizen-wh-review-date">
                {formatReviewDate(review.createdAt)}
              </p>

              {review.title ? (
                <p className="trizen-wh-review-title">{review.title}</p>
              ) : null}

              <p className="trizen-wh-review-body">{review.body}</p>

              <Link
                href={`/product/${review.productSlug}`}
                className="trizen-wh-review-product-bar group"
              >
                {review.productImage ? (
                  <span className="trizen-wh-review-product-thumb">
                    <ProductImage
                      src={review.productImage}
                      alt=""
                      sizes="48px"
                      className="p-0.5"
                    />
                  </span>
                ) : null}
                <span className="trizen-wh-review-product-label">
                  Review for {review.productName}
                </span>
              </Link>
            </article>
            ))
          ) : (
            <div className="trizen-wh-review-empty py-10 md:py-12">
              <p className="text-sm font-light text-zinc-500">
                No reviews yet. Order a product and leave the first review.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
