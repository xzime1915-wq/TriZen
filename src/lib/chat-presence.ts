export const TYPING_ACTIVE_MS = 5000;

export function isTypingActive(at: Date | string | null | undefined): boolean {
  if (!at) return false;
  const t = typeof at === "string" ? new Date(at).getTime() : at.getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < TYPING_ACTIVE_MS;
}

export function isMessageSeen(
  messageCreatedAt: Date | string,
  readerLastReadAt: Date | string | null | undefined
): boolean {
  if (!readerLastReadAt) return false;
  const msgTime = new Date(messageCreatedAt).getTime();
  const readTime = new Date(readerLastReadAt).getTime();
  if (Number.isNaN(msgTime) || Number.isNaN(readTime)) return false;
  return msgTime <= readTime;
}

export function applySeenToMessages<
  T extends { sender: string; createdAt: string; seen?: boolean },
>(messages: T[], viewer: "visitor" | "admin", adminLastReadAt: string | null, visitorLastReadAt: string | null): T[] {
  return messages.map((m) => {
    if (m.sender !== viewer) return m;
    const readerAt =
      viewer === "visitor" ? adminLastReadAt : visitorLastReadAt;
    return {
      ...m,
      seen: isMessageSeen(m.createdAt, readerAt),
    };
  });
}
