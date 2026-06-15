"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TrizenBrandName } from "@/components/TrizenBrandName";
import { SandboxSubscribeForm } from "@/components/SandboxSubscribeForm";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import { useNewsletterUi } from "@/lib/newsletter-ui-store";

/** Permanent — after subscribe or "No thanks" / close */
const DISMISS_KEY = "trizen-newsletter-popup-dismissed";
/** Once per browser tab session — avoid re-opening on every page change */
const SESSION_KEY = "trizen-newsletter-popup-session";

const HIDDEN_PATH_PREFIXES = [
  "/admin",
  "/sign-in",
  "/register",
  "/checkout",
  "/cart",
  "/forgot-password",
  "/reset-password",
];

type Props = {
  signedIn: boolean;
  userEmail?: string | null;
  userName?: string | null;
};

function isHiddenRoute(pathname: string) {
  return HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function permanentlyDismissed() {
  if (typeof window === "undefined") return true;
  return Boolean(window.localStorage.getItem(DISMISS_KEY));
}

function markPermanentDismiss(reason: "dismissed" | "subscribed") {
  window.localStorage.setItem(DISMISS_KEY, reason);
  window.sessionStorage.setItem(SESSION_KEY, "1");
}

export function NewsletterPopup({ signedIn, userEmail, userName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const scheduledRef = useRef(false);
  const manualOpen = useNewsletterUi((s) => s.isOpen);
  const closeNewsletter = useNewsletterUi((s) => s.closeNewsletter);
  const visible = manualOpen || (open && !signedIn);

  const hiddenRoute = isHiddenRoute(pathname);
  const prefilledFirstName = userName?.trim().split(/\s+/)[0] ?? "";

  function handleSubscribeSuccess() {
    setSubscribed(true);
    markPermanentDismiss("subscribed");
    window.setTimeout(() => {
      setOpen(false);
      closeNewsletter();
      setSubscribed(false);
    }, 1400);
  }

  useEffect(() => {
    if (signedIn) {
      setOpen(false);
      return;
    }

    if (hiddenRoute || permanentlyDismissed()) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    if (scheduledRef.current) return;

    scheduledRef.current = true;
    const timer = window.setTimeout(() => {
      if (permanentlyDismissed()) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [signedIn, hiddenRoute]);

  useEffect(() => {
    if (!visible) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismissWithoutEmail();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  function dismissWithoutEmail() {
    markPermanentDismiss("dismissed");
    setOpen(false);
    closeNewsletter();
  }

  if (!visible) return null;

  return (
    <div
      className="newsletter-popup-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <button
        type="button"
        className="newsletter-popup-backdrop"
        onClick={dismissWithoutEmail}
        aria-label="Close Sandbox popup"
      />

      <div className="newsletter-popup-panel">
        <button
          type="button"
          onClick={dismissWithoutEmail}
          className="newsletter-popup-close"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <p className="newsletter-popup-eyebrow">
          <TrizenBrandName className="inline-flex text-[10px] text-zinc-300" />
          <span className="trizen-wh-hero-eyebrow text-zinc-500">Sandbox</span>
        </p>

        <h2 id="newsletter-popup-title" className="newsletter-popup-title">
          New product news and esports news in your inbox
        </h2>

        <p className="newsletter-popup-copy">
          Drops, restocks, and competitive play updates from TRIZEN Store.
        </p>

        {subscribed ? (
          <p className="newsletter-popup-success">Thanks, you&apos;re on the list.</p>
        ) : (
          <SandboxSubscribeForm
            initialEmail={userEmail ?? ""}
            initialFirstName={prefilledFirstName}
            onSuccess={handleSubscribeSuccess}
          />
        )}

        <p className="newsletter-popup-note">
          By subscribing, you agree with our privacy policy.
        </p>

        <button type="button" onClick={dismissWithoutEmail} className="newsletter-popup-dismiss">
          No thanks
        </button>
      </div>
    </div>
  );
}
