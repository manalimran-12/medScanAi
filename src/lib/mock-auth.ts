import { cookies } from "next/headers";
import { store, randomId, findUserById } from "./mock-store";
import type { User } from "@/types/api";

const ACCESS_TOKEN_PREFIX = "mock_access_";
const REFRESH_COOKIE = "fyp_refresh";
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export function issueSession(userId: string): { accessToken: string; refreshToken: string } {
  const accessToken = ACCESS_TOKEN_PREFIX + userId + ":" + randomId();
  const refreshToken = "mock_refresh_" + randomId() + randomId();
  store.sessions.set(refreshToken, userId);
  return { accessToken, refreshToken };
}

export function parseAccessToken(token: string | null): string | null {
  if (!token || !token.startsWith(ACCESS_TOKEN_PREFIX)) return null;
  const body = token.slice(ACCESS_TOKEN_PREFIX.length);
  const [userId] = body.split(":");
  return userId || null;
}

export async function getUserFromRequest(req: Request): Promise<User | null> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const userId = parseAccessToken(auth.slice(7));
  if (!userId) return null;
  const user = await findUserById(userId);
  if (!user) return null;
  const { passwordHash: _h, ...publicUser } = user;
  return publicUser;
}

export function setRefreshCookie(token: string) {
  cookies().set({
    name: REFRESH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

export function clearRefreshCookie() {
  cookies().delete(REFRESH_COOKIE);
}

export function getRefreshCookie(): string | null {
  return cookies().get(REFRESH_COOKIE)?.value ?? null;
}

export { REFRESH_COOKIE };
