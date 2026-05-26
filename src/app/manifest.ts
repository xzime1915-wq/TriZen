import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TriZen Store",
    short_name: "TriZen",
    description:
      "Bangladesh's premium esports gear — glass mouse pads, soft pads, skates & sleeves.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait",
    categories: ["shopping", "sports"],
    icons: [
      {
        src: "/og-image.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/og-image.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
