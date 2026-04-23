import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByEmail, store, randomId, toPublicUser } from "@/lib/mock-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten() }, { status: 400 });
  }
  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return NextResponse.json({ message: "Email already registered" }, { status: 409 });
  }
  const user = await createUser(parsed.data);
  const verifyToken = randomId() + randomId();
  store.verifyTokens.set(verifyToken, user.id);
  console.log(`[mock] verify email link: /verify-email?token=${verifyToken}`);
  return NextResponse.json({
    data: { user: toPublicUser(user), needsVerification: true },
  });
}
