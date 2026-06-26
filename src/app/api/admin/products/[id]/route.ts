import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProductDbPayload } from "@/lib/admin-product-payload";
import { notifyProductWaitlist } from "@/lib/product-notify";
import { isProductAvailable, isUpcoming } from "@/lib/product-status";
import { generateUniqueBarcode } from "@/lib/inventory-server";
import { isValidBarcode } from "@/lib/inventory-codes";

function uniqueProductError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : "SKU, barcode, or slug";
    return NextResponse.json(
      { error: `Product ${target} is already in use.` },
      { status: 409 }
    );
  }
  return null;
}

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
  if (!before) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const barcode = payload.barcode || before.barcode || (await generateUniqueBarcode());
  if (!isValidBarcode(barcode)) {
    return NextResponse.json(
      { error: "Barcode must contain 8 to 18 digits." },
      { status: 400 }
    );
  }

  let product = before;
  try {
    product = await prisma.product.update({
      where: { id },
      data: { ...payload, barcode },
    });
  } catch (error) {
    const response = uniqueProductError(error);
    if (response) return response;
    throw error;
  }

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
