import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store, toPublicUser } from "@/lib/mock-store";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: user });
}

const patchSchema = z.object({ name: z.string().min(2).max(80).optional() });

export async function PATCH(req: Request) {
  const current = await getUserFromRequest(req);
  if (!current) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const user = store.users.find((u) => u.id === current.id)!;
  if (parsed.data.name !== undefined) user.name = parsed.data.name;
  return NextResponse.json({ data: toPublicUser(user) });
}

export async function DELETE(req: Request) {
  const current = await getUserFromRequest(req);
  if (!current) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const idx = store.users.findIndex((u) => u.id === current.id);
  if (idx >= 0) store.users.splice(idx, 1);
  return NextResponse.json({ data: { success: true } });
}
