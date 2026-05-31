"use client";

import { TrizenLogo } from "@/components/TrizenLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  MessageCircle,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/chat", label: "Live Chat", icon: MessageCircle },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
      <div className="p-4 border-b border-[var(--color-border)]">
        <Link href="/admin" className="flex items-center gap-2">
          <TrizenLogo variant="on-light" alt="TriZen" width={32} height={32} />
          <span className="text-xs font-semibold uppercase tracking-widest">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition",
              pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"))
                ? "bg-white text-black"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-zinc-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-muted)] truncate">{admin.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-2 flex items-center gap-2 text-xs text-red-400 hover:text-red-300"
        >
          <LogOut className="h-3 w-3" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
