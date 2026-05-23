import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildPresenceMeta,
  createChatMessage,
  listMessages,
  markAdminRead,
  messagesWithPresence,
  toMessageDto,
} from "@/lib/chat";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since") ?? undefined;

    const existing = await prisma.chatConversation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const conversation = await markAdminRead(id);
    const messages = await listMessages(id, since);
    const meta = buildPresenceMeta(conversation, "admin");

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        visitorName: conversation.visitorName,
        visitorEmail: conversation.visitorEmail,
        status: conversation.status,
      },
      messages: messagesWithPresence(messages, "admin", meta),
      meta,
    });
  } catch (e) {
    console.error("[admin/chat/messages GET]", e);
    return NextResponse.json(
      { error: "Could not load messages. Restart the dev server." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
    });
    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const message = await createChatMessage({
      conversationId: id,
      sender: "admin",
      body: body.body,
      attachmentUrl: body.attachmentUrl ?? null,
      attachmentType: body.attachmentType ?? null,
    });

    const row = await prisma.chatConversation.findUnique({ where: { id } });
    const meta = row ? buildPresenceMeta(row, "admin") : undefined;

    return NextResponse.json({
      message: { ...toMessageDto(message), seen: false },
      meta,
    });
  } catch (e) {
    console.error("[admin/chat/messages POST]", e);
    const msg = e instanceof Error ? e.message : "Failed to send";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
