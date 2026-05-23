import { Inter } from "next/font/google";

const invoiceFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-invoice",
});

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${invoiceFont.variable} ${invoiceFont.className}`}>
      {children}
    </div>
  );
}
