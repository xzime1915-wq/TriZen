import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { getUserSession } from "@/lib/user-auth";

export const metadata: Metadata = {
  title: "TriZen Store | Premium Esports Gear",
  description:
    "Shop premium esports gear — glass mouse pads, hand sleeves, and mouse skates. Built for competitive play at TriZen Store.",
  icons: { icon: "/logo.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserSession();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased font-sans bg-[var(--color-surface)] overflow-x-clip">
        <CartProvider>
          <Header user={user ? { name: user.name, email: user.email } : null} />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
