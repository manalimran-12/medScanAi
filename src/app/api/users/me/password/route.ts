import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/mock-auth";
import { hashPassword, store, verifyPassword } from "@/lib/mock-store";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(req: Request) {
  const current = await getUserFromRequest(req);
  if (!current) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const user = store.users.find((u) => u.id === current.id)!;
  if (!verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
  }
  user.passwordHash = hashPassword(parsed.data.newPassword);
  return NextResponse.json({ data: { success: true } });
}
