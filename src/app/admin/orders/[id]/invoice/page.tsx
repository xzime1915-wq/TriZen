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

  return (
  <>
    <InvoiceActions invoiceNumber={order.invoiceNumber ?? order.orderNumber} />
    <div className="invoice-print min-h-screen bg-white text-black p-8 md:p-12 max-w-4xl mx-auto">
      <header className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="TriZen Store" width={56} height={56} />
          <div>
            <h1 className="text-xl font-bold uppercase tracking-[0.15em]">
              {settings?.storeName || "TriZen Store"}
            </h1>
            <p className="text-sm text-gray-600">{settings?.tagline}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-2xl font-bold uppercase">Invoice</p>
          <p className="font-mono mt-1">{order.invoiceNumber}</p>
          <p className="text-gray-600 mt-2">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600">Order: {order.orderNumber}</p>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2 text-gray-500">
            Bill To
          </p>
          <p className="font-semibold">{order.customerName}</p>
          <p>{order.customerEmail}</p>
          <p>{order.customerPhone}</p>
          <p className="mt-2">
            {order.shippingAddress}
            <br />
            {order.city}
            {order.country ? `, ${order.country}` : ""}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2 text-gray-500">
            From
          </p>
          <p className="font-semibold">{settings?.storeName}</p>
          <p>{settings?.email}</p>
          <p>{settings?.phone}</p>
          <p className="mt-2">{settings?.address}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b-2 border-black text-left text-xs uppercase">
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
        <div className="w-64 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Charge</span>
            <span>{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t-2 border-black pt-2">
            <span>Total Due</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-300 pt-6 text-sm text-gray-600">
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
