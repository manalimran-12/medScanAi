import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail, toPublicUser, verifyPassword, store } from "@/lib/mock-store";
import { issueSession, setRefreshCookie } from "@/lib/mock-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
  const user = await findUserByEmail(parsed.data.email);
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }
  if (user.status === "DISABLED") {
    return NextResponse.json({ message: "Account is disabled" }, { status: 403 });
  }
  const { accessToken, refreshToken } = issueSession(user.id);
  setRefreshCookie(refreshToken);
  store.auditLogs.unshift({
    id: "a_" + Math.random().toString(36).slice(2, 8),
    userId: user.id,
    userEmail: user.email,
    action: "auth.login",
    entityType: null,
    entityId: null,
    ip: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({
    data: { accessToken, user: toPublicUser(user) },
  });
}
