import { randomBytes } from "node:crypto";

const CSRF_COOKIE = "__csrf";

// Cache generated tokens per request object so multiple components
// in the same render can call ensureCsrfToken and get the same value.
const tokenCache = new WeakMap<Request, string>();

function parseCsrfCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx < 0) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    if (key === CSRF_COOKIE) return value;
  }
  return null;
}

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Returns the existing CSRF token from the request cookie, or generates and
 * caches a new one. Call Astro.response.headers.append('Set-Cookie', csrfCookieHeader(token))
 * when a new token is generated (i.e., when the cookie was not already present).
 */
export function ensureCsrfToken(request: Request): {
  token: string;
  isNew: boolean;
} {
  const existing = parseCsrfCookie(request);
  if (existing) return { token: existing, isNew: false };

  if (tokenCache.has(request)) {
    return { token: tokenCache.get(request)!, isNew: true };
  }

  const token = generateCsrfToken();
  tokenCache.set(request, token);
  return { token, isNew: true };
}

export function csrfCookieHeader(token: string): string {
  const parts = [
    `${CSRF_COOKIE}=${token}`,
    "SameSite=Strict",
    "Path=/",
  ];
  if (import.meta.env.PROD) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function validateCsrf(request: Request, formData: FormData): boolean {
  const cookieToken = parseCsrfCookie(request);
  const formToken = formData.get("__csrf");
  if (!cookieToken || typeof formToken !== "string" || !formToken) return false;
  return cookieToken === formToken;
}
