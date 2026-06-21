import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerAdmin } from "@/lib/auth";
import { pickSettingsUpdate, toCheckoutSettings } from "@/lib/store-settings";

export async function GET() {
  const settings = await prisma.storeSettings.findFirst();
  return NextResponse.json(toCheckoutSettings(settings));
}

export async function PATCH(request: Request) {
  const admin = await requireOwnerAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const update = pickSettingsUpdate(body);
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const settings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    update,
    create: { id: 1, ...update },
  });

  return NextResponse.json(settings);
}
