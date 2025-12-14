import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { generateAccountInsight } from "@/lib/ai";

const schema = z.object({
  accountId: z.string()
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const summary = await generateAccountInsight(parsed.data.accountId);
  return NextResponse.json({ summary });
}
