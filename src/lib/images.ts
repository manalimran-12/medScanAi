import { getAccessToken } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Converts a backend-relative image path (e.g. "/users/me/avatar/image")
 * into an absolute URL that includes the current access token as a query
 * parameter, so authenticated <img> tags work without needing Authorization
 * headers (which browsers can't set on <img> src).
 *
 * Passes through absolute URLs and data: URIs unchanged.
 */
export function withApiBase(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const token = getAccessToken();
  const separator = path.includes("?") ? "&" : "?";
  const tokenSuffix = token ? `${separator}access_token=${encodeURIComponent(token)}` : "";
  return `${API_BASE}${path}${tokenSuffix}`;
}
