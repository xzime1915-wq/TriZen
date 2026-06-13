"use client";

import { useEffect, useState } from "react";

type Props = {
  averageRating?: number;
  totalReviews?: number;
  className?: string;
  variant?: "light" | "dark";
};

type ReviewStats = {
  averageRating: number;
  totalReviews: number;
};

export function ReviewTrustBar({
  averageRating,
  totalReviews,
  className = "",
  variant = "light",
}: Props) {
  const [stats, setStats] = useState<ReviewStats | null>(
    averageRating !== undefined && totalReviews !== undefined
      ? { averageRating, totalReviews }
      : null
  );

  useEffect(() => {
    if (averageRating !== undefined && totalReviews !== undefined) return;

    fetch("/api/reviews/stats")
      .then((response) => response.json())
      .then((data: ReviewStats) => setStats(data))
      .catch(() => {});
  }, [averageRating, totalReviews]);

  if (!stats || stats.totalReviews === 0) return null;

  const textClass =
    variant === "dark" ? "text-[var(--color-foreground)]" : "text-zinc-900";

  return (
    <div className={`trizen-wh-trust-bar ${className}`.trim()}>
      <span className={textClass}>{stats.averageRating.toFixed(1)} ★★★★★</span>
      <span className="mx-2 opacity-40">|</span>
      <span className={textClass}>
        {stats.totalReviews.toLocaleString()} verified review
        {stats.totalReviews === 1 ? "" : "s"}
      </span>
    </div>
  );
}
