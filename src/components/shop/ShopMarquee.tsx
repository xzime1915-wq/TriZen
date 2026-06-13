import { HomeMarqueeWord } from "@/components/home/HomeMarqueeWord";

const MARQUEE_WORDS = ["ESPORTS", "BANGLADESH"] as const;
const MARQUEE_REPEAT = 5;

function MarqueeWords({ idPrefix }: { idPrefix: string }) {
  return Array.from({ length: MARQUEE_WORDS.length * MARQUEE_REPEAT }, (_, index) => {
    const word = MARQUEE_WORDS[index % MARQUEE_WORDS.length];
    const variant = index % 2 === 0 ? "solid" : "hollow";

    return (
      <span key={`${idPrefix}-${word}-${index}`} className="home-marquee-item">
        <HomeMarqueeWord word={word} variant={variant} />
      </span>
    );
  });
}

export function ShopMarquee() {
  return (
    <section
      className="shop-marquee home-marquee relative overflow-x-hidden bg-white py-8 sm:py-10 md:py-12"
      aria-hidden
    >
      <div className="home-marquee-track relative z-[1] flex whitespace-nowrap">
        <div className="home-marquee-strip flex items-center">
          <MarqueeWords idPrefix="a" />
        </div>
        <div className="home-marquee-strip flex items-center" aria-hidden>
          <MarqueeWords idPrefix="b" />
        </div>
      </div>
    </section>
  );
}
