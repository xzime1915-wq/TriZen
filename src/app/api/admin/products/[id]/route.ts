import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProductDbPayload } from "@/lib/admin-product-payload";
import { notifyProductWaitlist } from "@/lib/product-notify";
import { isProductAvailable, isUpcoming } from "@/lib/product-status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const payload = buildProductDbPayload(body);
  const before = await prisma.product.findUnique({ where: { id } });
  const product = await prisma.product.update({ where: { id }, data: payload });

  if (
    before &&
    isUpcoming(before.tag) &&
    isProductAvailable(product)
  ) {
    void notifyProductWaitlist(product.id).catch((error) => {
      console.error(`Failed to notify waitlist for ${product.slug}:`, error);
    });
  }

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
