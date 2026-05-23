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

export type ChatConversationSummary = {
  id: string;
  visitorName: string;
  visitorEmail: string | null;
  status: string;
  unreadAdmin?: number;
  lastMessageAt?: string;
  lastMessage?: ChatMessageDto | null;
};
