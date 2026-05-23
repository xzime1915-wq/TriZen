import { NextResponse } from "next/server";
import {
  assertVisitorConversation,
  buildPresenceMeta,
  createChatMessage,
  getOrCreateVisitorConversation,
  listMessages,
  markVisitorRead,
  messagesWithPresence,
  toMessageDto,
} from "@/lib/chat";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since") ?? undefined;
    let conversationId = searchParams.get("conversationId") ?? undefined;

    let conversation;
    if (!conversationId) {
      conversation = await getOrCreateVisitorConversation();
      conversationId = conversation.id;
    } else {
      conversation = await assertVisitorConversation(conversationId);
      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    }

    const updated = await markVisitorRead(conversationId);
    const messages = await listMessages(conversationId, since);
    const meta = buildPresenceMeta(updated, "visitor");

    return NextResponse.json({
      conversationId,
      messages: messagesWithPresence(messages, "visitor", meta),
      meta,
    });
  } catch (e) {
    console.error("[chat/messages GET]", e);
    return NextResponse.json(
      {
        error:
          "Chat is temporarily unavailable. Restart the dev server and try again.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const conversationId = body.conversationId as string | undefined;
    const text = (body.body as string | undefined) ?? "";
    const attachmentUrl = (body.attachmentUrl as string | undefined) ?? null;
    const attachmentType = (body.attachmentType as string | undefined) ?? null;

    const conversation = conversationId
      ? await assertVisitorConversation(conversationId)
      : await getOrCreateVisitorConversation();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.status === "closed") {
      return NextResponse.json({ error: "Chat is closed" }, { status: 403 });
    }

    const message = await createChatMessage({
      conversationId: conversation.id,
      sender: "visitor",
      body: text,
      attachmentUrl,
      attachmentType,
    });

    const row = await prisma.chatConversation.findUnique({
      where: { id: conversation.id },
    });
    const meta = row ? buildPresenceMeta(row, "visitor") : undefined;

    return NextResponse.json({
      message: { ...toMessageDto(message), seen: false },
      meta,
    });
  } catch (e) {
    console.error("[chat/messages POST]", e);
    const msg = e instanceof Error ? e.message : "Failed to send message";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
