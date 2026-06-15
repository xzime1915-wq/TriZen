import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as { code?: string };
  const code = String(body.code ?? "").trim();

  if (!code) {
    return NextResponse.json({ error: "Enter a discount code" }, { status: 400 });
  }

  return NextResponse.json(
    { error: "This discount code is not valid" },
    { status: 400 }
  );
}
