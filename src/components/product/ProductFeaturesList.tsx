import { Check } from "lucide-react";

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
      <h3 className="text-xs font-light uppercase tracking-[0.14em] text-zinc-900 mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {features.map((f) => (
          <li
            key={f}
            className="trizen-prose flex gap-3 leading-snug"
          >
            <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
