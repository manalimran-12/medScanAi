import { NextResponse } from "next/server";
import { store } from "@/lib/mock-store";
import { clearRefreshCookie, getRefreshCookie } from "@/lib/mock-auth";

export async function POST() {
  const token = getRefreshCookie();
  if (token) store.sessions.delete(token);
  clearRefreshCookie();
  return NextResponse.json({ data: { success: true } });
}
