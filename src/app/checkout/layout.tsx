import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/user-auth";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  if (!user) redirect("/sign-in?next=/checkout");

  return children;
}
