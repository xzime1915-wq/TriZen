"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MEDIA_SELECTOR = "img, picture, video, svg, [data-protected-media]";

function isProtectedMedia(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-allow-media-save]")) return false;
  return Boolean(target.closest(MEDIA_SELECTOR));
}

/** Deter casual save/select on images, banners, and icons (not foolproof). */
export function MediaProtect() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      document.body.classList.remove("site-media-protect");
      return;
    }

    document.body.classList.add("site-media-protect");

    const blockIfMedia = (e: Event) => {
      if (isProtectedMedia(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", blockIfMedia);
    document.addEventListener("dragstart", blockIfMedia);
    document.addEventListener("selectstart", blockIfMedia);
    document.addEventListener("copy", blockIfMedia);

    return () => {
      document.body.classList.remove("site-media-protect");
      document.removeEventListener("contextmenu", blockIfMedia);
      document.removeEventListener("dragstart", blockIfMedia);
      document.removeEventListener("selectstart", blockIfMedia);
      document.removeEventListener("copy", blockIfMedia);
    };
  }, [pathname]);

  return null;
}
