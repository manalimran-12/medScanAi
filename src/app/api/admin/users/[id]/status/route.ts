import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store, toPublicUser } from "@/lib/mock-store";

const schema = z.object({ status: z.enum(["ACTIVE", "DISABLED"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const me = await getUserFromRequest(req);
  if (!me) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (me.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const u = store.users.find((x) => x.id === params.id);
  if (!u) return NextResponse.json({ message: "Not found" }, { status: 404 });
  u.status = parsed.data.status;
  return NextResponse.json({ data: toPublicUser(u) });
}
