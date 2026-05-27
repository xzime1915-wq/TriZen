"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { StarRating } from "./StarRating";
import type { ProductReviewData } from "./ProductDetailView";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => {
        if (!user) return;
        setAuthorName((n) => n || user.name || "");
        setAuthorEmail((e) => e || user.email || "");
      })
      .catch(() => {});
  }, []);

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
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        {reviews.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            Be the first to review this product.
          </p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border border-[var(--color-border)] p-5 bg-white/30"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} size="sm" />
                    <span className="text-sm font-medium">{r.authorName}</span>
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">
                    {new Date(r.createdAt).toLocaleDateString("en-BD")}
                  </span>
                </div>
                {r.title && (
                  <p className="font-semibold text-sm mb-2 text-[var(--color-foreground)]">{r.title}</p>
                )}
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border border-[var(--color-border)] p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Add a review</h3>

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
          <p className="text-emerald-400 text-sm mt-4">Thank you! Your review has been posted.</p>
        )}

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}
