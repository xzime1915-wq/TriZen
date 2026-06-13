"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/Button";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";

type Props = {
  productSlug: string;
  productName: string;
  variant?: "default" | "compact";
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubscribed?: () => void;
};

function buttonSize(variant: "default" | "compact"): "md" | "lg" {
  return variant === "compact" ? "md" : "lg";
}

function NotifyDrawer({
  open,
  onClose,
  productName,
  email,
  setEmail,
  loggedIn,
  subscribed,
  loading,
  error,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  email: string;
  setEmail: (value: string) => void;
  loggedIn: boolean;
  subscribed: boolean;
  loading: boolean;
  error: string;
  onSubmit: (notifyEmail: string) => void;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="notify-drawer-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notify-drawer-title"
    >
      <button
        type="button"
        className="notify-drawer-backdrop"
        onClick={onClose}
        aria-label="Close notify panel"
      />
      <aside className="notify-drawer-panel">
        <header className="notify-drawer-header">
          <button
            type="button"
            onClick={onClose}
            className="notify-drawer-close"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="notify-drawer-header-label">
            <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <span>Coming soon</span>
          </div>
          <span className="notify-drawer-header-spacer" aria-hidden />
        </header>

        <div className="notify-drawer-body" data-lenis-prevent>
          {subscribed ? (
            <div className="notify-drawer-success">
              <p className="notify-drawer-kicker">You&apos;re on the list</p>
              <p className="notify-drawer-copy">
                We will email {email} from support@trizenstore.com.bd when{" "}
                {productName} is available.
              </p>
              <Button className="mt-8 w-full" size="lg" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <h2 id="notify-drawer-title" className="notify-drawer-title">
                Item is coming soon
              </h2>
              <p className="notify-drawer-copy">
                Notify me when this product is available to order.
              </p>

              <form
                className="notify-drawer-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSubmit(email);
                }}
              >
                <label className="notify-drawer-field">
                  <span className="notify-drawer-field-label">E-mail</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    readOnly={loggedIn}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="notify-drawer-input"
                  />
                </label>

                {loggedIn ? (
                  <p className="notify-drawer-hint">
                    Using your account email. No login needed.
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="notify-drawer-submit w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Notify me"}
                </Button>

                {error ? <p className="notify-drawer-error">{error}</p> : null}

                <p className="notify-drawer-footnote">
                  Get an email notification when the product is available on the
                  site.
                </p>
              </form>
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}

export function ProductNotifyButton({
  productSlug,
  productName,
  variant = "default",
  hideTrigger = false,
  open: controlledOpen,
  onOpenChange,
  onSubscribed,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/products/${productSlug}/notify`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (data.loggedIn && data.email) {
          setLoggedIn(true);
          setEmail(data.email);
        }
        if (data.subscribed) {
          setSubscribed(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [productSlug]);

  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const submitNotify = useCallback(
    async (notifyEmail: string) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/products/${productSlug}/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: notifyEmail }),
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not save your email.");
          return;
        }

        setSubscribed(true);
        onSubscribed?.();
      } catch {
        setError("Could not save your email. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [productSlug, onSubscribed]
  );

  if (checking && !hideTrigger) {
    return (
      <Button
        disabled
        className={variant === "compact" ? "w-full" : "w-full"}
        size={buttonSize(variant)}
      >
        Notify me
      </Button>
    );
  }

  const showSubscribedButton = subscribed && !open;
  const wrapperClass =
    variant === "compact" ? "w-full" : "product-buy-actions w-full";

  if (showSubscribedButton && !hideTrigger) {
    return (
      <div className={wrapperClass}>
        <Button disabled className="w-full" size={buttonSize(variant)}>
          {variant === "compact" ? "On the list" : "You're on the list"}
        </Button>
        {variant === "default" ? (
          <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
            We will email {email || "you"} from support@trizenstore.com.bd when{" "}
            {productName} is available.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {!hideTrigger ? (
        <div className={wrapperClass}>
          <Button
            className="w-full"
            size={buttonSize(variant)}
            onClick={() => setOpen(true)}
            disabled={subscribed}
          >
            {subscribed
              ? variant === "compact"
                ? "On the list"
                : "You're on the list"
              : "Notify me"}
          </Button>
        </div>
      ) : null}

      <NotifyDrawer
        open={open}
        onClose={() => setOpen(false)}
        productName={productName}
        email={email}
        setEmail={setEmail}
        loggedIn={loggedIn}
        subscribed={subscribed}
        loading={loading}
        error={error}
        onSubmit={(notifyEmail) => {
          void submitNotify(notifyEmail);
        }}
      />
    </>
  );
}
