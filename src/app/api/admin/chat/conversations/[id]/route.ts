import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const status = body.status as string | undefined;

  if (status && !["open", "closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const conversation = await prisma.chatConversation.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(body.markRead ? { unreadAdmin: 0 } : {}),
    },
  });

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      status: conversation.status,
      unreadAdmin: conversation.unreadAdmin,
    },
  });
}
