import { NextResponse } from "next/server";
import {
  getOrCreateVisitorConversation,
  getVisitorConversation,
} from "@/lib/chat";

export async function GET() {
  try {
    const conversation = await getVisitorConversation();
    if (!conversation) {
      return NextResponse.json({ conversation: null });
    }
    return NextResponse.json({
      conversation: {
        id: conversation.id,
        visitorName: conversation.visitorName,
        visitorEmail: conversation.visitorEmail,
        status: conversation.status,
      },
    });
  } catch (e) {
    console.error("[chat/conversation GET]", e);
    return NextResponse.json(
      { error: "Chat is temporarily unavailable. Please refresh the page." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let visitorName: string | undefined;
    let visitorEmail: string | undefined;
    try {
      const body = await req.json();
      visitorName = body.visitorName;
      visitorEmail = body.visitorEmail;
    } catch {
      /* optional body */
    }

    const conversation = await getOrCreateVisitorConversation(
      visitorName,
      visitorEmail
    );

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        visitorName: conversation.visitorName,
        visitorEmail: conversation.visitorEmail,
        status: conversation.status,
      },
    });
  } catch (e) {
    console.error("[chat/conversation POST]", e);
    return NextResponse.json(
      { error: "Could not start chat. Please refresh and try again." },
      { status: 500 }
    );
  }
}
