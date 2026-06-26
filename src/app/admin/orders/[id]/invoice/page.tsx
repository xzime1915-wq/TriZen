import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { InvoiceActions } from "@/components/admin/InvoiceActions";
import { renderCode128Svg } from "@/lib/barcode-svg";
import { renderQrSvg } from "@/lib/qr-svg";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function svgDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              sku: true,
              barcode: true,
            },
          },
        },
      },
    },
  });
  if (!order) notFound();

  const settings = await prisma.storeSettings.findFirst();
  const storeName = settings?.storeName?.trim() || "TRIZEN Store";
  const tagline = settings?.tagline?.trim() || "Premium Esports Gear";
  const invoiceCode = order.invoiceNumber || order.orderNumber;
  const trackUrl = `${SITE_URL}/track-order?orderNumber=${encodeURIComponent(
    order.orderNumber
  )}`;
  const invoiceBarcodeSrc = svgDataUri(renderCode128Svg(invoiceCode));
  const invoiceQrSrc = svgDataUri(renderQrSvg(trackUrl));

  return (
  <>
    <InvoiceActions invoiceNumber={order.invoiceNumber ?? order.orderNumber} />
    <div className="invoice-print min-h-screen bg-white text-black px-8 pb-8 pt-4 md:px-12 md:pb-12 md:pt-6 max-w-4xl mx-auto">
      <header className="invoice-header flex justify-between items-start gap-6 border-b-2 border-black pb-6 mb-8">
        <div className="invoice-brand">
          <Image
            src="/logo_b.png"
            alt="TRIZEN Store"
            width={88}
            height={88}
            className="invoice-brand-logo"
            unoptimized
            priority
          />
          <div className="invoice-brand-text">
            <p className="invoice-brand-name">{storeName}</p>
            <p className="invoice-tagline">{tagline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="invoice-heading uppercase">Invoice</p>
          <p className="invoice-meta-id mt-1">{order.invoiceNumber}</p>
          <p className="invoice-meta mt-2">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="invoice-meta">Order: {order.orderNumber}</p>
          <div className="invoice-code-panel mt-4 flex items-center justify-end gap-3">
            <div className="text-right">
              <p className="invoice-code-label">Invoice Barcode</p>
              <img
                src={invoiceBarcodeSrc}
                alt={`Invoice barcode ${invoiceCode}`}
                className="invoice-barcode-img"
              />
            </div>
            <div className="text-right">
              <p className="invoice-code-label">Track QR</p>
              <img
                src={invoiceQrSrc}
                alt={`Track order QR ${order.orderNumber}`}
                className="invoice-qr-img"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="invoice-address-grid grid sm:grid-cols-2 gap-x-10 gap-y-6 mb-8">
        <div className="invoice-address-col min-w-0">
          <p className="invoice-section-label mb-2">Bill To</p>
          <p className="font-semibold">{order.customerName}</p>
          <p className="break-words">{order.customerEmail}</p>
          <p>{order.customerPhone}</p>
          <p className="mt-2 break-words">
            {order.shippingAddress}
            <br />
            {order.city}
            {order.country ? `, ${order.country}` : ""}
          </p>
        </div>
        <div className="invoice-address-col min-w-0">
          <p className="invoice-section-label mb-2">From</p>
          <p className="font-semibold">{settings?.storeName}</p>
          <p className="break-words">{settings?.email}</p>
          <p>{settings?.phone}</p>
          <p className="mt-2 break-words">{settings?.address}</p>
        </div>
      </div>

      <table className="invoice-table w-full mb-8">
        <thead>
          <tr className="border-b-2 border-black text-left">
            <th className="py-2">Description</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-right">Unit Price</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3">
                <p>{item.name}</p>
                <p className="invoice-item-code mt-1">
                  SKU: {item.product.sku} | Barcode: {item.product.barcode}
                </p>
              </td>
              <td className="py-3 text-center">{item.quantity}</td>
              <td className="py-3 text-right">{formatCurrency(item.price)}</td>
              <td className="py-3 text-right">
                {formatCurrency(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between invoice-meta">
            <span>Subtotal</span>
            <span className="text-black">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between invoice-meta">
            <span>Delivery Charge</span>
            <span className="text-black">{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="invoice-total-row flex justify-between border-t-2 border-black pt-2">
            <span>Total Due</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-300 pt-6">
        <p>
          <strong>Payment Method:</strong> Cash on Delivery (COD),{" "}
          {getStatusLabel(order.status)}
        </p>
        <p className="mt-2">
          Collect <strong>{formatCurrency(order.total)}</strong> in cash upon delivery.
        </p>
        <p className="mt-6 text-xs">
          Thank you for shopping at TRIZEN Store. For questions contact {settings?.email}
        </p>
      </footer>
    </div>
  </>
  );
}
