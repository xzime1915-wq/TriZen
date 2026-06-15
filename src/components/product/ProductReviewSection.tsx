"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { ProductImage } from "@/components/ProductImage";
import { StarRating } from "./StarRating";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import type { ProductReviewData } from "./ProductDetailView";

type Eligibility = {
  eligible: boolean;
  reason?: string;
};

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ReviewWriteModal({
  open,
  onClose,
  slug,
  productName,
  productImage,
  onReviewAdded,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  productName: string;
  productImage: string;
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
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadEligibility() {
      setCheckingEligibility(true);
      setError("");
      setSuccess(false);

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
  }, [open, slug, authorEmail]);

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
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="review-modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <button
        type="button"
        className="review-modal-backdrop"
        onClick={onClose}
        aria-label="Close review form"
      />

      <div className="review-modal-panel" data-lenis-prevent>
        <button
          type="button"
          onClick={onClose}
          className="review-modal-close"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="review-modal-product">
          <span className="review-modal-product-thumb">
            <ProductImage
              src={productImage}
              alt={productName}
              sizes="96px"
              className="p-0.5"
            />
          </span>
          <div className="min-w-0">
            <p className="review-modal-product-kicker">Write a review</p>
            <h2 id="review-modal-title" className="review-modal-product-name">
              {productName}
            </h2>
          </div>
        </div>

        {checkingEligibility ? (
          <p className="review-modal-copy">Checking review eligibility...</p>
        ) : success ? (
          <div className="review-modal-success">
            <p className="review-modal-success-title">Thank you</p>
            <p className="review-modal-copy">
              Your verified review has been posted.
            </p>
            <Button className="mt-6 w-full" size="lg" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : eligibility.eligible ? (
          <form onSubmit={handleSubmit} className="review-modal-form">
            <div>
              <p className="review-modal-field-label">Your rating</p>
              <StarRating value={rating} interactive onChange={setRating} />
            </div>

            <label className="review-modal-field">
              <span className="review-modal-field-label">Name</span>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="review-modal-input"
                autoComplete="name"
              />
            </label>

            <label className="review-modal-field">
              <span className="review-modal-field-label">Email</span>
              <input
                type="email"
                required
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="review-modal-input"
                autoComplete="email"
              />
            </label>

            <label className="review-modal-field">
              <span className="review-modal-field-label">Review title (optional)</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="review-modal-input"
              />
            </label>

            <label className="review-modal-field">
              <span className="review-modal-field-label">Your review</span>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="review-modal-textarea"
              />
            </label>

            {error ? <p className="review-modal-error">{error}</p> : null}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit review"}
            </Button>
          </form>
        ) : (
          <div className="review-modal-verify">
            <p className="review-modal-copy">
              {eligibility.reason ||
                "Only customers who purchased and received this product can leave a review."}
            </p>

            {!signedIn ? (
              <div className="review-modal-form mt-6">
                <label className="review-modal-field">
                  <span className="review-modal-field-label">Order email</span>
                  <input
                    type="email"
                    placeholder="Email used when ordering"
                    value={orderEmailInput}
                    onChange={(e) => setOrderEmailInput(e.target.value)}
                    className="review-modal-input"
                  />
                </label>
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  disabled={!orderEmailInput.trim() || checkingEligibility}
                  onClick={() => setAuthorEmail(orderEmailInput.trim().toLowerCase())}
                >
                  {checkingEligibility ? "Checking..." : "Verify order email"}
                </Button>
                <p className="review-modal-footnote">
                  Use the same email from your delivered order.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function ProductReviewSection({
  slug,
  productName,
  productImage,
  reviews,
  onReviewAdded,
}: {
  slug: string;
  productName: string;
  productImage: string;
  reviews: ProductReviewData[];
  onReviewAdded: (review: ProductReviewData) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  return (
    <div className="product-reviews-section">
      {reviews.length > 0 ? (
        <>
          <div className="product-reviews-summary">
            <StarRating value={avgRating} size="sm" />
            <p className="product-reviews-summary-text">
              {avgRating} out of 5 · {reviews.length} review
              {reviews.length === 1 ? "" : "s"}
            </p>
          </div>

          <ul className="product-reviews-list">
            {reviews.map((review) => (
              <li key={review.id} className="product-reviews-item">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StarRating value={review.rating} size="sm" />
                  <span className="trizen-wh-review-date">
                    {formatReviewDate(review.createdAt)}
                  </span>
                </div>

                <div className="trizen-wh-review-author-row">
                  <span className="trizen-wh-review-author">{review.authorName}</span>
                  {review.verified ? (
                    <span className="trizen-wh-review-verified">Verified</span>
                  ) : null}
                </div>

                {review.title ? (
                  <p className="trizen-wh-review-title">{review.title}</p>
                ) : null}

                <p className="trizen-wh-review-body">{review.body}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="product-reviews-empty">
          No verified reviews yet. Be the first after your order is delivered.
        </p>
      )}

      <div className="product-reviews-action">
        <button
          type="button"
          className="trizen-wh-reviews-btn"
          onClick={() => setModalOpen(true)}
        >
          Write a review
        </button>
      </div>

      <ReviewWriteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slug={slug}
        productName={productName}
        productImage={productImage}
        onReviewAdded={onReviewAdded}
      />
    </div>
  );
}
