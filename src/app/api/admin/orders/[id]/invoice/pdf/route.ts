import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildInvoicePdf } from "@/lib/invoice-pdf";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const settings = await prisma.storeSettings.findFirst();
  const pdfBytes = await buildInvoicePdf(order, settings);
  const filename = `invoice-${(order.invoiceNumber || order.orderNumber).replace(/[^a-zA-Z0-9-]/g, "")}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
