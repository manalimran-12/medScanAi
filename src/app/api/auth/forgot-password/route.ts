import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail, randomId, store } from "@/lib/mock-store";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const user = await findUserByEmail(parsed.data.email);
  if (user) {
    const token = randomId() + randomId();
    store.resetTokens.set(token, user.id);
    console.log(`[mock] password reset link: /reset-password?token=${token}`);
  }
  // Always succeed to avoid account enumeration
  return NextResponse.json({ data: { success: true } });
}
