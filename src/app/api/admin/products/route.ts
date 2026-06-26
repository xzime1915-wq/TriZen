import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProductDbPayload } from "@/lib/admin-product-payload";
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

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { sku: { contains: q } },
            { barcode: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const payload = buildProductDbPayload(body);
  const barcode = payload.barcode || (await generateUniqueBarcode());
  if (!isValidBarcode(barcode)) {
    return NextResponse.json(
      { error: "Barcode must contain 8 to 18 digits." },
      { status: 400 }
    );
  }

  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  try {
    const product = await prisma.product.create({
      data: { ...payload, barcode, slug },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const response = uniqueProductError(error);
    if (response) return response;
    throw error;
  }
}
