import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAppUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { renderQrSvg } from "@/lib/qr-svg";

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
    select: { name: true, slug: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestOrigin = new URL(request.url).origin;
  const appUrl = getAppUrl(requestOrigin) || requestOrigin;
  const productUrl = `${appUrl}/product/${product.slug}`;
  let svg: string;

  try {
    svg = renderQrSvg(productUrl, { title: product.name });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create QR code.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `inline; filename="${product.slug}-qr.svg"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
