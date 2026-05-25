import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { InvoiceActions } from "@/components/admin/InvoiceActions";

export const dynamic = "force-dynamic";

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
    include: { items: true },
  });
  if (!order) notFound();

  const settings = await prisma.storeSettings.findFirst();
  const storeName = settings?.storeName?.trim() || "TriZen Store";
  const tagline = settings?.tagline?.trim() || "Premium Esports Gear";

  return (
  <>
    <InvoiceActions invoiceNumber={order.invoiceNumber ?? order.orderNumber} />
    <div className="invoice-print min-h-screen bg-white text-black px-8 pb-8 pt-4 md:px-12 md:pb-12 md:pt-6 max-w-4xl mx-auto">
      <header className="invoice-header flex justify-between items-start gap-6 border-b-2 border-black pb-6 mb-8">
        <div className="invoice-brand">
          <Image
            src="/logo_b.png"
            alt="TriZen Store"
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
              <td className="py-3">{item.name}</td>
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
          <strong>Payment Method:</strong> Cash on Delivery (COD) —{" "}
          {getStatusLabel(order.status)}
        </p>
        <p className="mt-2">
          Collect <strong>{formatCurrency(order.total)}</strong> in cash upon delivery.
        </p>
        <p className="mt-6 text-xs">
          Thank you for shopping at TriZen Store. For questions contact {settings?.email}
        </p>
      </footer>
    </div>
  </>
  );
}
