"use client";

import { useState } from "react";

export function CheckoutPromoCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter a discount code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "This discount code is not valid");
      }
    } catch {
      setError("Could not apply code. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-promo">
      <div className="checkout-promo-row">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleApply();
            }
          }}
          placeholder="Discount code or promo code"
          className="checkout-promo-input"
          aria-label="Discount code or promo code"
        />
        <button
          type="button"
          onClick={() => void handleApply()}
          disabled={loading || !code.trim()}
          className="checkout-promo-apply"
        >
          {loading ? "…" : "Apply"}
        </button>
      </div>
      {error ? <p className="checkout-promo-error">{error}</p> : null}
    </div>
  );
}
