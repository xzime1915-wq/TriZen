import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ChatWidgetHost } from "@/components/chat/ChatWidgetHost";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { getUserSession } from "@/lib/user-auth";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Esports Gear`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | Premium Esports Gear`,
    description:
      "Glass mouse pads, soft pads, skates & sleeves for competitive play. Shop TriPad V1 with COD and mobile wallet checkout.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Premium Esports Gear`,
    description:
      "Glass mouse pads, soft pads, skates & sleeves. TriPad V1 in stock — COD, bKash & Nagad across Bangladesh.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/logo.png", type: "image/png", sizes: "500x500" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserSession();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased font-sans bg-[var(--color-surface)] overflow-x-clip">
        <SiteJsonLd />
        <CartProvider>
          <Header user={user ? { name: user.name, email: user.email } : null} />
          <main className="flex-1 max-lg:pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <ChatWidgetHost />
        </CartProvider>
      </body>
    </html>
  );
}
