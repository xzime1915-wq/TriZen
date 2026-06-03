import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ChatWidgetHost } from "@/components/chat/ChatWidgetHost";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { MediaProtect } from "@/components/MediaProtect";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getUserSession } from "@/lib/user-auth";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Esports Mouse Pad Bangladesh`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | Premium Esports Gear`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Esports Gear`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon-48.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserSession();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased font-sans bg-[var(--color-surface)] overflow-x-clip">
        <SmoothScroll />
        <MediaProtect />
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
