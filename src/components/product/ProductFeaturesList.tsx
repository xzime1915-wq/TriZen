import { sanitizeDisplayText } from "@/lib/utils";

export function ProductFeaturesList({
  features,
  title = "Key Features",
}: {
  features: string[];
  title?: string;
}) {
  if (features.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-xs font-light uppercase tracking-[0.14em] text-zinc-900">
        {title}
      </h3>
      <ul className="product-buy-features">
        {features.map((f) => (
          <li key={f} className="trizen-detail">
            {sanitizeDisplayText(f)}
          </li>
        ))}
      </ul>
    </div>
  );
}
