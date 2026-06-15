import { ReviewTrustBar } from "@/components/ReviewTrustBar";

type Props = {
  averageRating?: number;
  totalReviews?: number;
};

export function HomeCta({ averageRating, totalReviews }: Props) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-trizen-full flex min-h-[44vh] flex-col items-center justify-center py-20 text-center sm:py-24 md:min-h-[50vh] md:py-28">
        <h2 className="trizen-display-title home-cta-title">
          <span className="home-cta-title-line">Upgrade your desk</span>
          <span className="home-cta-title-line">Upgrade your aim</span>
        </h2>
        <p className="home-cta-subtitle mx-auto mt-5 max-w-lg sm:mt-7">
          Premium esports gear, shipped across Bangladesh
        </p>
      </div>

      <ReviewTrustBar
        averageRating={averageRating}
        totalReviews={totalReviews}
        className="border-t border-zinc-200 text-zinc-900"
      />
    </section>
  );
}
