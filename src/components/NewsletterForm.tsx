"use client";

import { useState } from "react";
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
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  const isSection = variant === "section";

  return (
    <form onSubmit={handleSubmit} className={isSection ? "mx-auto max-w-xl" : ""}>
      {isSection ? (
        <p className="mb-6 text-center text-[10px] font-light uppercase tracking-[0.32em] text-zinc-900">
          Subscribe to our newsletter
        </p>
      ) : (
        <p className="mb-4 text-sm leading-relaxed text-[var(--color-muted)]">
          Sign up for updates about new drops and restocks.
        </p>
      )}

      <div className={isSection ? "trizen-box-inline" : "trizen-box-stack"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className={cn(
            "trizen-box-field",
            isSection &&
              "trizen-box-field--inline font-normal placeholder:font-light placeholder:text-zinc-900",
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
          "mt-3 text-[10px] font-light text-zinc-900",
          isSection && "text-center",
        )}
      >
        By signing up, you agree with our privacy policy.
      </p>
      {status === "error" ? (
        <p className="mt-2 text-xs text-red-400">Could not subscribe. Try again.</p>
      ) : null}
    </form>
  );
}
