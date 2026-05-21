import Link from "next/link";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: Date;
  items: OrderItem[];
};

export function AccountOrders({ orders, email }: { orders: Order[]; email: string }) {
  if (orders.length === 0) {
    return (
      <div className="mt-10 border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)] text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-2">My Orders</h2>
        <p className="text-sm text-[var(--color-muted)] mb-6">
          You have not placed any orders with this account yet.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-4">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
              <div>
                <p className="text-xs text-[var(--color-muted)] uppercase">Order</p>
                <p className="font-mono font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </p>
                <p className="font-semibold mt-1">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <ul className="px-4 sm:px-5 py-3 space-y-2 text-sm border-b border-[var(--color-border)]">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span className="text-[var(--color-muted)]">
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 p-4 sm:p-5">
              <Link
                href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(email)}`}
                className="text-xs uppercase tracking-wider border border-[var(--color-border)] px-4 py-2 hover:border-white transition"
              >
                Track
              </Link>
              <Link
                href={`/order-confirmation/${order.orderNumber}?email=${encodeURIComponent(email)}`}
                className="text-xs uppercase tracking-wider hover:underline"
              >
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
