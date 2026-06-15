"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import type { ShopGearLine } from "@/lib/shop-gears";

type Props = {
  gear: ShopGearLine;
  gearName: string;
  className?: string;
};

function NotifyDrawer({
  open,
  onClose,
  gearName,
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
  gearName: string;
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
      aria-labelledby="gear-notify-drawer-title"
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
            <span>Not launched yet</span>
          </div>
          <span className="notify-drawer-header-spacer" aria-hidden />
        </header>

        <div className="notify-drawer-body" data-lenis-prevent>
          {subscribed ? (
            <div className="notify-drawer-success">
              <p className="notify-drawer-kicker">You&apos;re on the list</p>
              <p className="notify-drawer-copy">
                We will email {email} from support@trizenstore.com.bd when{" "}
                {gearName} launches at TRIZEN Store.
              </p>
              <Button className="mt-8 w-full" size="lg" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <h2 id="gear-notify-drawer-title" className="notify-drawer-title">
                {gearName} coming soon
              </h2>
              <p className="notify-drawer-copy">
                Notify me when this category launches at TRIZEN Store.
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
                  Get an email when products in this category are available to
                  order.
                </p>
              </form>
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}

export function GearNotifyButton({ gear, gearName, className }: Props) {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`/api/gear/${gear}/notify`)
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
  }, [gear]);

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
        const response = await fetch(`/api/gear/${gear}/notify`, {
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
      } catch {
        setError("Could not save your email. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [gear],
  );

  if (checking) {
    return (
      <div className={cn("w-full", className)}>
        <Button disabled className="w-full">
          Notify me
        </Button>
      </div>
    );
  }

  if (subscribed && !open) {
    return (
      <div className={cn("w-full", className)}>
        <Button disabled className="w-full">
          You&apos;re on the list
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Button
        className="w-full"
        onClick={() => setOpen(true)}
        disabled={subscribed}
      >
        Notify me
      </Button>

      <NotifyDrawer
        open={open}
        onClose={() => setOpen(false)}
        gearName={gearName}
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
    </div>
  );
}
