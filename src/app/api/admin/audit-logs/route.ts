import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store } from "@/lib/mock-store";

export async function GET(req: Request) {
  const me = await getUserFromRequest(req);
  if (!me) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (me.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(url.searchParams.get("pageSize") ?? "20", 10)));
  const rows = [...store.auditLogs];
  const total = rows.length;
  const start = (page - 1) * pageSize;
  return NextResponse.json({
    data: rows.slice(start, start + pageSize),
    meta: { pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) } },
  });
}
