import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store, toPublicUser } from "@/lib/mock-store";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const me = await getUserFromRequest(req);
  if (!me) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (me.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const u = store.users.find((x) => x.id === params.id);
  if (!u) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const predictionCount = store.predictions.filter((p) => p.userId === u.id).length;
  return NextResponse.json({ data: { ...toPublicUser(u), predictionCount } });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const me = await getUserFromRequest(req);
  if (!me) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (me.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const idx = store.users.findIndex((x) => x.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  store.users.splice(idx, 1);
  return NextResponse.json({ data: { success: true } });
}
