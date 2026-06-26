import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateUniqueBarcode } from "@/lib/inventory-server";

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const barcode = await generateUniqueBarcode();
  return NextResponse.json({ barcode });
}
