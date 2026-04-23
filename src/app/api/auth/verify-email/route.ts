import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/mock-store";

const schema = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const userId = store.verifyTokens.get(parsed.data.token);
  if (!userId) return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  const user = store.users.find((u) => u.id === userId);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  user.emailVerifiedAt = new Date().toISOString();
  user.status = "ACTIVE";
  store.verifyTokens.delete(parsed.data.token);
  return NextResponse.json({ data: { success: true } });
}
