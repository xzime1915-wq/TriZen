import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderCode128Svg } from "@/lib/barcode-svg";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, slug: true, sku: true, barcode: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const svg = renderCode128Svg(product.barcode, {
    title: `${product.name} / ${product.sku}`,
  });
  const disposition = new URL(request.url).searchParams.has("download")
    ? "attachment"
    : "inline";


  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `${disposition}; filename="${product.slug}-barcode.svg"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
