import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store } from "@/lib/mock-store";

export async function POST(req: Request) {
  const current = await getUserFromRequest(req);
  if (!current) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }
  // Mock: convert to data URL so the preview works without real storage
  const buf = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;
  const user = store.users.find((u) => u.id === current.id)!;
  user.avatarUrl = dataUrl;
  return NextResponse.json({ data: { avatarUrl: dataUrl } });
}
