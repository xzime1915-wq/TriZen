"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TrizenBrandName } from "@/components/TrizenBrandName";
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

export function NewsletterPopup({ signedIn }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const scheduledRef = useRef(false);
  const manualOpen = useNewsletterUi((s) => s.isOpen);
  const closeNewsletter = useNewsletterUi((s) => s.closeNewsletter);
  const visible = open || manualOpen;

  const hiddenRoute = isHiddenRoute(pathname);

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          firstName: firstName.trim(),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      markPermanentDismiss("subscribed");
      window.setTimeout(() => {
        setOpen(false);
        closeNewsletter();
      }, 1400);
    } catch {
      setStatus("error");
    }
  }

  if (signedIn || !visible) return null;

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

        {status === "done" ? (
          <p className="newsletter-popup-success">Thanks, you&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-popup-form">
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Name"
              autoComplete="given-name"
              className="newsletter-popup-input normal-case tracking-normal placeholder:uppercase"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
              autoComplete="email"
              className="newsletter-popup-input normal-case tracking-normal placeholder:uppercase"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="newsletter-popup-submit"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
            {status === "error" ? (
              <p className="newsletter-popup-error">Could not subscribe. Try again.</p>
            ) : null}
          </form>
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
