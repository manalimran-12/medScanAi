import { NextResponse } from "next/server";
import { store } from "@/lib/mock-store";
import { getRefreshCookie, issueSession, setRefreshCookie } from "@/lib/mock-auth";

export async function POST() {
  const token = getRefreshCookie();
  if (!token) return NextResponse.json({ message: "Missing refresh token" }, { status: 401 });
  const userId = store.sessions.get(token);
  if (!userId) return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });

  // rotate: invalidate old, issue new
  store.sessions.delete(token);
  const { accessToken, refreshToken } = issueSession(userId);
  setRefreshCookie(refreshToken);
  return NextResponse.json({ data: { accessToken } });
}
