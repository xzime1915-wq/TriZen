"use client";

import { Mail } from "lucide-react";
import { useNewsletterUi } from "@/lib/newsletter-ui-store";

export function HomeNewsletter() {
  const openNewsletter = useNewsletterUi((s) => s.openNewsletter);

  return (
    <section
      id="sandbox"
      className="home-newsletter-section flex min-h-[60vh] flex-col md:min-h-[85vh] lg:min-h-[92vh]"
    >
      <video
        className="home-newsletter-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src="/videos/video.mp4" type="video/mp4" />
      </video>

      <div className="container-trizen-full home-newsletter-content flex flex-1 flex-col items-center justify-center py-28 md:py-56 lg:py-64">
        <div className="mx-auto max-w-2xl text-center">
          <Mail
            className="home-newsletter-icon mx-auto mb-4 h-6 w-6 text-white md:mb-6 md:h-8 md:w-8"
            strokeWidth={1.25}
          />
          <h2 className="home-newsletter-title trizen-display-title">
            Join Sandbox
          </h2>
          <div className="home-newsletter-cta mt-5 md:mt-8">
            <button
              type="button"
              onClick={openNewsletter}
              className="trizen-wh-ghost-btn home-newsletter-subscribe-btn"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
