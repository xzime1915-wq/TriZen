"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  url: string;
  title: string;
  className?: string;
};

type ShareOption = {
  id: string;
  label: string;
  href: string;
  icon: "facebook" | "x" | "linkedin" | "whatsapp";
};

function buildShareOptions(url: string, title: string): ShareOption[] {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const whatsappText = encodeURIComponent(`${title} ${url}`);

  return [
    {
      id: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "facebook",
    },
    {
      id: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "x",
    },
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: "linkedin",
    },
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${whatsappText}`,
      icon: "whatsapp",
    },
  ];
}

function ShareIcon({ type }: { type: ShareOption["icon"] }) {
  if (type === "facebook") {
    return (
      <Image
        src="/social/facebook.png"
        alt=""
        width={18}
        height={18}
        className="h-[18px] w-[18px] object-contain"
        aria-hidden
      />
    );
  }

  if (type === "whatsapp") {
    return (
      <Image
        src="/social/whatsapp.png"
        alt=""
        width={18}
        height={18}
        className="h-[18px] w-[18px] object-contain"
        aria-hidden
      />
    );
  }

  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
        <path
          fill="currentColor"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.291 19.497h2.039L6.486 3.24H4.298l13.312 17.41z"
      />
    </svg>
  );
}

export function BlogShareBar({ url, title, className }: Props) {
  const [copied, setCopied] = useState(false);
  const [nativeShareFailed, setNativeShareFailed] = useState(false);
  const options = buildShareOptions(url, title);
  const canNativeShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    !nativeShareFailed;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url, text: title });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNativeShareFailed(true);
    }
  }

  return (
    <div className={cn("blog-share-bar", className)}>
      <p className="blog-share-label">Share this post</p>

      <div className="blog-share-actions">
        {options.map((option) => (
          <a
            key={option.id}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={option.label}
            className="blog-share-btn"
          >
            <ShareIcon type={option.icon} />
          </a>
        ))}

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={cn("blog-share-btn", copied && "blog-share-btn--copied")}
        >
          {copied ? (
            <Check className="h-[18px] w-[18px]" strokeWidth={1.75} />
          ) : (
            <Link2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          )}
        </button>

        {canNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            aria-label="Share"
            className="blog-share-btn blog-share-btn--native"
          >
            <Share2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {copied ? <p className="blog-share-feedback">Link copied</p> : null}
    </div>
  );
}
