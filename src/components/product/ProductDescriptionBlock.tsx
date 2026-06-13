import { ProductDescriptionCarousel } from "./ProductDescriptionCarousel";
import { ProductFeaturesList } from "./ProductFeaturesList";

type Props = {
  productName: string;
  description: string;
  descriptionSlides?: string[];
  features: string[];
};

export function ProductDescriptionBlock({
  productName,
  description,
  descriptionSlides = [],
  features,
}: Props) {
  const paragraphs = description
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0 && descriptionSlides.length === 0 && features.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="product-page-pad py-14 md:py-20">
        {descriptionSlides.length > 0 && (
          <div className="mx-auto w-full max-w-4xl">
            <ProductDescriptionCarousel slides={descriptionSlides} />
          </div>
        )}

        {paragraphs.length > 0 && (
          <div
            className={`mx-auto w-full max-w-3xl ${
              descriptionSlides.length > 0 ? "mt-14 md:mt-16" : ""
            }`}
          >
            <h2 className="trizen-headline text-lg md:text-2xl">{productName}</h2>
            <div className="mt-6 space-y-5 text-sm leading-[1.75] text-zinc-600 normal-case md:text-[0.9375rem]">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {features.length > 0 && (
          <div className="mx-auto mt-12 w-full max-w-3xl pt-10 md:mt-16">
            <ProductFeaturesList features={features} title="Features" />
          </div>
        )}
      </div>
    </section>
  );
}
