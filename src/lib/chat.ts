import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";
import { applySeenToMessages, isTypingActive } from "./chat-presence";

export const CHAT_VISITOR_COOKIE = "trizen_chat_visitor";
export const CHAT_POLL_MS = 3000;

export type ChatMessageDto = {
  id: string;
  sender: "visitor" | "admin";
  body: string;
  attachmentUrl: string | null;
  attachmentType: string | null;
  createdAt: string;
  seen?: boolean;
};

export type ChatPresenceMeta = {
  otherTyping: boolean;
  adminLastReadAt: string | null;
  visitorLastReadAt: string | null;
};

export type ChatConversationDto = {
  id: string;
  visitorName: string;
  visitorEmail: string | null;
  status: string;
  unreadAdmin: number;
  lastMessageAt: string;
  lastMessage?: ChatMessageDto | null;
};

export function toMessageDto(m: {
  id: string;
  sender: string;
  body: string;
  attachmentUrl: string | null;
  attachmentType: string | null;
  createdAt: Date;
}): ChatMessageDto {
  return {
    id: m.id,
    sender: m.sender as "visitor" | "admin",
    body: m.body,
    attachmentUrl: m.attachmentUrl,
    attachmentType: m.attachmentType,
    createdAt: m.createdAt.toISOString(),
  };
}

export async function getVisitorSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CHAT_VISITOR_COOKIE)?.value?.trim();
  if (existing) return existing;

  const id = randomUUID();
  jar.set(CHAT_VISITOR_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

export async function getOrCreateVisitorConversation(
  visitorName?: string,
  visitorEmail?: string
) {
  const visitorSessionId = await getVisitorSessionId();
  const existing = await prisma.chatConversation.findUnique({
    where: { visitorSessionId },
  });

  if (existing) {
    const updates: { visitorName?: string; visitorEmail?: string } = {};
    if (visitorName?.trim()) updates.visitorName = visitorName.trim();
    if (visitorEmail?.trim()) updates.visitorEmail = visitorEmail.trim();
    if (Object.keys(updates).length > 0) {
      return prisma.chatConversation.update({
        where: { id: existing.id },
        data: updates,
      });
    }
    return existing;
  }

  return prisma.chatConversation.create({
    data: {
      visitorSessionId,
      visitorName: visitorName?.trim() || "Guest",
      visitorEmail: visitorEmail?.trim() || null,
    },
  });
}

export async function getVisitorConversation() {
  const visitorSessionId = await getVisitorSessionId();
  return prisma.chatConversation.findUnique({
    where: { visitorSessionId },
  });
}

export async function assertVisitorConversation(conversationId: string) {
  const visitorSessionId = await getVisitorSessionId();
  const conversation = await prisma.chatConversation.findFirst({
    where: { id: conversationId, visitorSessionId },
  });
  if (!conversation) return null;
  return conversation;
}

export async function listMessages(
  conversationId: string,
  since?: string
) {
  const sinceDate = since ? new Date(since) : null;
  return prisma.chatMessage.findMany({
    where: {
      conversationId,
      ...(sinceDate && !Number.isNaN(sinceDate.getTime())
        ? { createdAt: { gt: sinceDate } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 200,
  });
}

export async function createChatMessage(input: {
  conversationId: string;
  sender: "visitor" | "admin";
  body?: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
}) {
  const body = input.body?.trim() ?? "";
  const hasAttachment = Boolean(input.attachmentUrl);

  if (!body && !hasAttachment) {
    throw new Error("Message cannot be empty");
  }

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: input.conversationId,
      sender: input.sender,
      body,
      attachmentUrl: input.attachmentUrl ?? null,
      attachmentType: input.attachmentType ?? null,
    },
  });

  await prisma.chatConversation.update({
    where: { id: input.conversationId },
    data: {
      lastMessageAt: message.createdAt,
      ...(input.sender === "visitor"
        ? { unreadAdmin: { increment: 1 } }
        : { unreadAdmin: 0 }),
    },
  });

  return message;
}

export async function markVisitorRead(conversationId: string) {
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: { visitorLastReadAt: new Date() },
  });
}

export async function markAdminRead(conversationId: string) {
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: { adminLastReadAt: new Date(), unreadAdmin: 0 },
  });
}

export async function setVisitorTyping(conversationId: string) {
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: { visitorTypingAt: new Date() },
  });
}

export async function setAdminTyping(conversationId: string) {
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: { adminTypingAt: new Date() },
  });
}

export function buildPresenceMeta(
  conversation: {
    visitorTypingAt: Date | null;
    adminTypingAt: Date | null;
    visitorLastReadAt: Date | null;
    adminLastReadAt: Date | null;
  },
  viewer: "visitor" | "admin"
): ChatPresenceMeta {
  return {
    otherTyping:
      viewer === "visitor"
        ? isTypingActive(conversation.adminTypingAt)
        : isTypingActive(conversation.visitorTypingAt),
    adminLastReadAt: conversation.adminLastReadAt?.toISOString() ?? null,
    visitorLastReadAt: conversation.visitorLastReadAt?.toISOString() ?? null,
  };
}

export function messagesWithPresence(
  messages: {
    id: string;
    sender: string;
    body: string;
    attachmentUrl: string | null;
    attachmentType: string | null;
    createdAt: Date;
  }[],
  viewer: "visitor" | "admin",
  meta: ChatPresenceMeta
) {
  const dtos = messages.map(toMessageDto);
  return applySeenToMessages(
    dtos,
    viewer,
    meta.adminLastReadAt,
    meta.visitorLastReadAt
  );
}
