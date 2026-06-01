import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Poll for new orders + chat unread (admin notification bell). */
export async function GET(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sinceRaw = searchParams.get("since");
  const since = sinceRaw ? new Date(sinceRaw) : new Date(0);
  const sinceValid = !Number.isNaN(since.getTime()) ? since : new Date(0);

  const [orders, chatAgg, latestChat] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gt: sinceValid } },
      orderBy: { createdAt: "asc" },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        createdAt: true,
      },
    }),
    prisma.chatConversation.aggregate({ _sum: { unreadAdmin: true } }),
    prisma.chatConversation.findFirst({
      where: { unreadAdmin: { gt: 0 } },
      orderBy: { lastMessageAt: "desc" },
      select: {
        id: true,
        visitorName: true,
        unreadAdmin: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true, attachmentUrl: true },
        },
      },
    }),
  ]);

  const lastMsg = latestChat?.messages[0];
  const chatPreview =
    lastMsg?.body?.trim() ||
    (lastMsg?.attachmentUrl ? "Attachment" : null);

  return NextResponse.json({
    orders: orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    })),
    chatUnread: chatAgg._sum.unreadAdmin ?? 0,
    latestChat: latestChat
      ? {
          visitorName: latestChat.visitorName,
          preview: chatPreview,
          unread: latestChat.unreadAdmin,
        }
      : null,
    serverTime: new Date().toISOString(),
  });
}
