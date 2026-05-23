import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toMessageDto } from "@/lib/chat";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.chatConversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    take: 100,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      visitorName: c.visitorName,
      visitorEmail: c.visitorEmail,
      status: c.status,
      unreadAdmin: c.unreadAdmin,
      lastMessageAt: c.lastMessageAt.toISOString(),
      lastMessage: c.messages[0] ? toMessageDto(c.messages[0]) : null,
    })),
  });
}
