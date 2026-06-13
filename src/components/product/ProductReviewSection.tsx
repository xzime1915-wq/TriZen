"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { StarRating } from "./StarRating";
import type { ProductReviewData } from "./ProductDetailView";

type Eligibility = {
  eligible: boolean;
  reason?: string;
};

export function ProductReviewSection({
  slug,
  reviews,
  onReviewAdded,
}: {
  slug: string;
  reviews: ProductReviewData[];
  onReviewAdded: (review: ProductReviewData) => void;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [orderEmailInput, setOrderEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [eligibility, setEligibility] = useState<Eligibility>({ eligible: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadEligibility() {
      setCheckingEligibility(true);

      try {
        const meRes = await fetch("/api/auth/me");
        const { user } = await meRes.json();

        if (cancelled) return;

        const email = user?.email || authorEmail || null;

        if (user) {
          setSignedIn(true);
          setAuthorName((name) => name || user.name || "");
          setAuthorEmail((value) => value || user.email || "");
        } else {
          setSignedIn(false);
        }

        const params = new URLSearchParams();
        if (!user && email) params.set("email", email);

        const eligibilityRes = await fetch(
          `/api/products/${slug}/reviews/eligibility${
            params.toString() ? `?${params.toString()}` : ""
          }`
        );
        const data = await eligibilityRes.json();

        if (!cancelled) {
          setEligibility(data);
        }
      } catch {
        if (!cancelled) {
          setEligibility({
            eligible: false,
            reason: "Could not check review eligibility.",
          });
        }
      } finally {
        if (!cancelled) {
          setCheckingEligibility(false);
        }
      }
    }

    loadEligibility();

    return () => {
      cancelled = true;
    };
  }, [slug, authorEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch(`/api/products/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        title,
        body,
        authorName,
        authorEmail,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not submit review");
      return;
    }

    onReviewAdded(data);
    setTitle("");
    setBody("");
    setRating(5);
    setSuccess(true);
    setEligibility({ eligible: false, reason: "You have already reviewed this purchase." });
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        {reviews.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            No verified reviews yet. Be the first after your order is delivered.
          </p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border border-[var(--color-border)] p-5 bg-white/30"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating value={r.rating} size="sm" />
                    <span className="text-sm font-medium">{r.authorName}</span>
                    {r.verified ? (
                      <span className="trizen-wh-review-verified">Verified</span>
                    ) : null}
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">
                    {new Date(r.createdAt).toLocaleDateString("en-BD")}
                  </span>
                </div>
                {r.title && (
                  <p className="font-semibold text-sm mb-2 text-[var(--color-foreground)]">
                    {r.title}
                  </p>
                )}
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {checkingEligibility ? (
        <div className="border border-[var(--color-border)] p-6">
          <p className="text-sm text-[var(--color-muted)]">Checking review eligibility...</p>
        </div>
      ) : eligibility.eligible ? (
        <form onSubmit={handleSubmit} className="border border-[var(--color-border)] p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Add a review</h3>
          <p className="text-xs text-[var(--color-muted)] mb-4">
            Verified purchase review. Your review will be linked to your delivered order.
          </p>

          <p className="text-sm text-[var(--color-muted)] mb-2">Your rating</p>
          <StarRating value={rating} interactive onChange={setRating} />
          <div className="mt-4 space-y-4">
            <Input
              label="Review title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Your review"
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Input
              label="Name"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          {success && (
            <p className="text-emerald-400 text-sm mt-4">
              Thank you! Your verified review has been posted.
            </p>
          )}

          <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
            {loading ? "Submitting..." : "Submit verified review"}
          </Button>
        </form>
      ) : (
        <div className="border border-[var(--color-border)] p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Verified reviews only</h3>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            {eligibility.reason ||
              "Only customers who purchased and received this product can leave a review."}
          </p>

          {!signedIn ? (
            <div className="mt-5 space-y-4">
              <Input
                label="Order email"
                type="email"
                placeholder="Email used when ordering"
                value={orderEmailInput}
                onChange={(e) => setOrderEmailInput(e.target.value)}
              />
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={!orderEmailInput.trim() || checkingEligibility}
                onClick={() => setAuthorEmail(orderEmailInput.trim().toLowerCase())}
              >
                {checkingEligibility ? "Checking..." : "Verify order email"}
              </Button>
              <p className="text-xs text-[var(--color-muted)]">
                Use the same email from your delivered order.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
