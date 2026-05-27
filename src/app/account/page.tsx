import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/user-auth";
import { getOrdersForUser } from "@/lib/user-orders";
import { SignOutButton } from "@/components/SignOutButton";
import { AccountOrders } from "@/components/account/AccountOrders";

export default async function AccountPage() {
  const user = await getUserSession();
  if (!user) redirect("/sign-in");

  const orders = await getOrdersForUser(user.id, user.email);

  return (
    <div className="container-trizen py-12 max-w-3xl">
      <div className="border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)]">
        <div className="flex items-center gap-4 mb-6">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={56}
              height={56}
              className="rounded-full border border-[var(--color-border)]"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-lg font-bold uppercase">
              {(user.name || user.email)[0]}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide">My Account</h1>
            <p className="text-sm text-[var(--color-muted)]">{user.email}</p>
          </div>
        </div>

        {user.name && (
          <p className="text-sm mb-2">
            <span className="text-[var(--color-muted)]">Name: </span>
            {user.name}
          </p>
        )}
        <p className="text-sm mb-8">
          <span className="text-[var(--color-muted)]">Signed in via: </span>
          {user.provider === "google" ? "Google" : "Email"}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition"
          >
            Shop
          </Link>
          <SignOutButton />
        </div>
      </div>

      <AccountOrders orders={orders} email={user.email} />
    </div>
  );
}
