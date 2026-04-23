import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store } from "@/lib/mock-store";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const p = store.predictions.find((x) => x.id === params.id);
  if (!p) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (p.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ data: p });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const idx = store.predictions.findIndex((x) => x.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const p = store.predictions[idx];
  if (p.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  store.predictions.splice(idx, 1);
  return NextResponse.json({ data: { success: true } });
}
