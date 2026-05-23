import { NextResponse } from "next/server";
import {
  assertVisitorConversation,
  getOrCreateVisitorConversation,
} from "@/lib/chat";
import { getUploadKind, saveChatUpload } from "@/lib/chat-upload";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const conversationId = String(form.get("conversationId") ?? "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const kind = getUploadKind(file.type);
    if (!kind) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const conversation = conversationId
      ? await assertVisitorConversation(conversationId)
      : await getOrCreateVisitorConversation();

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.status === "closed") {
      return NextResponse.json({ error: "Chat is closed" }, { status: 403 });
    }

    const saved = await saveChatUpload(conversation.id, file, kind);
    return NextResponse.json({
      conversationId: conversation.id,
      attachmentUrl: saved.url,
      attachmentType: saved.attachmentType,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
