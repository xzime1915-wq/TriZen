import { splitSanitizedParagraphs } from "@/lib/utils";
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
  const paragraphs = splitSanitizedParagraphs(description);

  if (paragraphs.length === 0 && descriptionSlides.length === 0 && features.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="product-page-pad py-14 md:py-20">
        {descriptionSlides.length > 0 && (
          <div className="mx-auto w-full max-w-3xl">
            <ProductDescriptionCarousel slides={descriptionSlides} />
          </div>
        )}

        {paragraphs.length > 0 && (
          <div
            className={`mx-auto w-full max-w-3xl ${
              descriptionSlides.length > 0 ? "mt-14 md:mt-16" : ""
            }`}
          >
            <h2 className="product-display-title md:text-2xl">{productName}</h2>
            <div className="trizen-prose mt-6 space-y-5">
              {paragraphs.map((para, index) => (
                <p key={`${index}-${para.slice(0, 48)}`}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {features.length > 0 && (
          <div className="mx-auto mt-12 w-full max-w-3xl pt-2 md:mt-14">
            <ProductFeaturesList features={features} title="Features" />
          </div>
        )}
      </div>
    </section>
  );
}
