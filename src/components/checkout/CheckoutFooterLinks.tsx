"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHECKOUT_POLICIES,
  CHECKOUT_POLICY_ORDER,
  type CheckoutPolicyId,
} from "@/lib/checkout-policies";

type Props = {
  className?: string;
};

export function CheckoutFooterLinks({ className }: Props) {
  const [openId, setOpenId] = useState<CheckoutPolicyId | null>(null);
  const policy = openId ? CHECKOUT_POLICIES[openId] : null;

  useEffect(() => {
    if (!openId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  return (
    <>
      <footer className={cn("checkout-footer-links", className)}>
        {CHECKOUT_POLICY_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpenId(id)}
            className="checkout-footer-link"
          >
            {CHECKOUT_POLICIES[id].label}
          </button>
        ))}
      </footer>

      {policy ? (
        <div
          className="checkout-policy-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout policy title"
        >
          <button
            type="button"
            className="checkout-policy-modal-backdrop"
            onClick={() => setOpenId(null)}
            aria-label="Close dialog"
          />
          <div className="checkout-policy-modal-panel">
            <header className="checkout-policy-modal-header">
              <h2 id="checkout-policy-title" className="checkout-policy-modal-title">
                {policy.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="checkout-policy-modal-close"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>
            <div className="checkout-policy-modal-body">{policy.content}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
