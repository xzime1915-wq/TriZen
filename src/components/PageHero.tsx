import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
};

export function PageHero({ eyebrow, title, description }: Props) {
  return (
    <section className="trizen-page-hero">
      <div
        className="trizen-glow-orb pointer-events-none absolute left-0 top-0 h-56 w-[min(100%,480px)] opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent"
        aria-hidden
      />
      <div className="container-trizen relative py-20 md:py-24 lg:py-28">
        {eyebrow ? <p className="trizen-eyebrow trizen-fade-in">{eyebrow}</p> : null}
        <h1 className="trizen-headline trizen-fade-in-delay-1 mt-4 text-4xl sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="trizen-body trizen-fade-in-delay-2 mt-5 max-w-2xl md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
