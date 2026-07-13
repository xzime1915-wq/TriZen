"use client";

import { useEffect } from "react";

type Language = "en" | "bn";

const STORAGE_KEY = "trizen-language";
const CHANGE_EVENT = "trizen-language-change";

const EN_TO_BN: Record<string, string> = {
  "Your cart is empty": "আপনার কার্ট খালি",
  "Your cart is empty.": "আপনার কার্ট খালি।",
  "Continue Shopping": "কেনাকাটা চালিয়ে যান",
  "Proceed to checkout": "চেকআউটে এগিয়ে যান",
  Checkout: "চেকআউট",
  Subtotal: "সাবটোটাল",
  Quantity: "পরিমাণ",
  Remove: "সরিয়ে দিন",
  "Shipping calculated at checkout": "চেকআউটের সময় শিপিং খরচ হিসাব হবে",
  "Add to cart": "কার্টে যোগ করুন",
  Added: "যোগ হয়েছে",
  "Buy now": "এখনই কিনুন",
  "Shop now": "এখনই কিনুন",
  "Shop collection": "কালেকশন দেখুন",
  "View collection": "কালেকশন দেখুন",
  Subscribe: "সাবস্ক্রাইব করুন",
  Email: "ইমেইল",
  "E-mail": "ইমেইল",
  "Email address": "ইমেইল ঠিকানা",
  "Email (optional)": "ইমেইল (ঐচ্ছিক)",
  Password: "পাসওয়ার্ড",
  "Confirm password": "পাসওয়ার্ড নিশ্চিত করুন",
  "Forgot password?": "পাসওয়ার্ড ভুলে গেছেন?",
  Login: "লগইন",
  "Signing in...": "সাইন ইন হচ্ছে...",
  "Create account": "অ্যাকাউন্ট তৈরি করুন",
  "Creating account...": "অ্যাকাউন্ট তৈরি হচ্ছে...",
  "Sign in": "সাইন ইন",
  "Continue with Google": "Google দিয়ে চালিয়ে যান",
  "Your name": "আপনার নাম",
  "Start Chat": "চ্যাট শুরু করুন",
  "Starting…": "শুরু হচ্ছে…",
  "Start a conversation with our team. We typically reply during business hours.":
    "আমাদের টিমের সঙ্গে কথা শুরু করুন। সাধারণত কর্মঘণ্টার মধ্যে উত্তর দেওয়া হয়।",
  "Say hello. We're here to help with orders, TriPad, and more.":
    "হ্যালো বলুন। অর্ডার, TriPad এবং অন্যান্য বিষয়ে সাহায্য করতে আমরা আছি।",
  "Type a message…": "মেসেজ লিখুন…",
  "Type a message...": "মেসেজ লিখুন...",
  "Send photo": "ছবি পাঠান",
  "Voice message": "ভয়েস মেসেজ",
  "Send message": "মেসেজ পাঠান",
  "Close chat": "চ্যাট বন্ধ করুন",
  "Open TRIZEN support chat": "TRIZEN সাপোর্ট চ্যাট খুলুন",
  "Chat with us": "আমাদের সঙ্গে চ্যাট করুন",
  "Loading…": "লোড হচ্ছে…",
  Loading: "লোড হচ্ছে",
  Search: "খুঁজুন",
  "Search for...": "খুঁজুন...",
  "No results found": "কোনো ফলাফল পাওয়া যায়নি",
  "Order number": "অর্ডার নম্বর",
  "Track order": "অর্ডার ট্র্যাক করুন",
  "First name": "নামের প্রথম অংশ",
  "Last name": "নামের শেষ অংশ",
  Phone: "ফোন",
  Address: "ঠিকানা",
  City: "শহর",
  "Postal code": "পোস্টাল কোড",
  "Place order": "অর্ডার করুন",
  "Back to shop": "শপে ফিরে যান",
  "Contact us": "যোগাযোগ করুন",
  "Read more": "আরও পড়ুন",
  "Show more": "আরও দেখুন",
  "Show less": "কম দেখুন",
  "The full TRIZEN lineup. Glass pads, soft pads, skates, and sleeves.":
    "TRIZEN-এর সম্পূর্ণ লাইনআপ—গ্লাস প্যাড, সফট প্যাড, স্কেটস ও স্লিভস।",
  "Low-friction glass helps your mouse move freely while the pad stays planted, built for ranked play and long sessions.":
    "লো-ফ্রিকশন গ্লাসে মাউস সহজে চলে, আর প্যাড স্থির থাকে—র‍্যাঙ্কড প্লে ও দীর্ঘ সেশনের জন্য তৈরি।",
  "Join Newsletter for the latest gear and esports updates.":
    "সর্বশেষ গিয়ার ও ইস্পোর্টস আপডেট পেতে নিউজলেটারে যোগ দিন।",
  "Shop Collection": "কালেকশন দেখুন",
  "Coming Soon": "শিগগিরই আসছে",
  "Unparalleled glide.": "অতুলনীয় গ্লাইড।",
  "Ultimate control.": "সর্বোচ্চ নিয়ন্ত্রণ।",
  "Soft touch.": "কোমল স্পর্শ।",
  "Precise control.": "নিখুঁত নিয়ন্ত্রণ।",
  "Low friction.": "কম ঘর্ষণ।",
  "Max performance.": "সর্বোচ্চ পারফরম্যান্স।",
  "Less friction.": "কম ঘর্ষণ।",
  "More focus.": "আরও মনোযোগ।"
};

const BN_TO_EN = Object.fromEntries(
  Object.entries(EN_TO_BN).map(([english, bangla]) => [bangla, english]),
) as Record<string, string>;

const SKIP_SELECTOR =
  "script, style, noscript, code, pre, svg, h1, h2, h3, h4, h5, h6, [data-language-static]";

function translateValue(value: string, language: Language) {
  const trimmed = value.trim();
  const normalized = trimmed.replace(/\s+/g, " ");
  if (!trimmed) return null;

  const translated =
    language === "bn" ? EN_TO_BN[normalized] : BN_TO_EN[normalized];
  if (!translated) return null;

  const start = value.indexOf(trimmed);
  return `${value.slice(0, start)}${translated}${value.slice(start + trimmed.length)}`;
}

function canTranslate(element: Element | null) {
  return !!element && !element.closest(SKIP_SELECTOR);
}

function markBangla(element: Element, language: Language) {
  element.classList.toggle("trizen-i18n-bn", language === "bn");
}

function translateRoot(root: ParentNode, language: Language) {
  const owner =
    root instanceof Document ? root.documentElement : root instanceof Element ? root : null;

  if (owner && canTranslate(owner)) {
    const walker = document.createTreeWalker(owner, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let current = walker.nextNode();
    while (current) {
      textNodes.push(current as Text);
      current = walker.nextNode();
    }

    for (const node of textNodes) {
      const parent = node.parentElement;
      if (!canTranslate(parent)) continue;
      const translated = translateValue(node.data, language);
      if (!translated) continue;
      node.data = translated;
      if (parent) markBangla(parent, language);
    }
  }

  const attributeElements: Element[] = [];
  if (owner?.matches("[placeholder], [aria-label], [title]")) {
    attributeElements.push(owner);
  }
  attributeElements.push(
    ...Array.from(root.querySelectorAll("[placeholder], [aria-label], [title]")),
  );

  for (const element of attributeElements) {
    if (!canTranslate(element)) continue;
    for (const attribute of ["placeholder", "aria-label", "title"]) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const translated = translateValue(value, language);
      if (!translated) continue;
      element.setAttribute(attribute, translated);
      markBangla(element, language);
    }
  }
}

export function LanguageRuntime() {
  useEffect(() => {
    let language: Language =
      window.localStorage.getItem(STORAGE_KEY) === "bn" ? "bn" : "en";
    let frame = 0;

    const apply = (root: ParentNode = document) => {
      document.documentElement.lang = language;
      document.documentElement.classList.toggle("trizen-lang-bn", language === "bn");
      if (language === "en") {
        document
          .querySelectorAll(".trizen-i18n-bn")
          .forEach((element) => element.classList.remove("trizen-i18n-bn"));
      }
      translateRoot(root, language);
    };

    const schedule = (root: ParentNode = document) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => apply(root));
    };

    apply();

    const observer = new MutationObserver((mutations) => {
      const added = mutations
        .flatMap((mutation) => Array.from(mutation.addedNodes))
        .find((node): node is Element => node instanceof Element);
      schedule(added ?? document);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const onLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next !== "en" && next !== "bn") return;
      language = next;
      apply();
    };

    window.addEventListener(CHANGE_EVENT, onLanguageChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener(CHANGE_EVENT, onLanguageChange);
    };
  }, []);

  return null;
}
