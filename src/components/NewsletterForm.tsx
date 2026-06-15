"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "footer" | "section";
};

export function NewsletterForm({ variant = "footer" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        Thanks, you&apos;re on the list.
      </p>
    );
  }

  const isSection = variant === "section";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isSection ? "mx-auto max-w-xl" : "trizen-footer-newsletter-form",
      )}
    >
      {isSection ? null : (
        <p className="trizen-footer-newsletter-copy">
          Join Sandbox for the latest gear and esports updates.
        </p>
      )}

      <div className={isSection ? "trizen-newsletter-inline" : "trizen-box-stack"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className={cn(
            "trizen-box-field",
            isSection &&
              "font-normal placeholder:font-light placeholder:text-zinc-900",
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="trizen-box-action disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>

      <p
        className={cn(
          "mt-3 text-[10px] leading-relaxed",
          isSection
            ? "text-center font-light text-zinc-900"
            : "trizen-footer-newsletter-note",
        )}
      >
        By signing up, you agree with our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
      {status === "error" ? (
        <p
          className={cn(
            "mt-2 text-xs",
            isSection ? "text-red-600" : "text-red-400",
          )}
        >
          Could not subscribe. Try again.
        </p>
      ) : null}
    </form>
  );
}
