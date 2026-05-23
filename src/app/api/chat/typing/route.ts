import { NextResponse } from "next/server";
import { assertVisitorConversation, setVisitorTyping } from "@/lib/chat";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const conversationId = String(body.conversationId ?? "");
    const conversation = await assertVisitorConversation(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await setVisitorTyping(conversationId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
