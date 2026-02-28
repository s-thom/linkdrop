import { sealData, unsealData } from "iron-session";
import { SESSION_SECRET } from "astro:env/server";

const SESSION_COOKIE = "__session";

interface SessionData {
  userId?: string;
  sessionVersion?: number;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx < 0) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    if (key) cookies[key] = value;
  }
  return cookies;
}

async function getSessionData(request: Request): Promise<SessionData> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parseCookies(cookieHeader);
  const sealed = cookies[SESSION_COOKIE];
  if (!sealed) return {};

  try {
    return await unsealData<SessionData>(sealed, { password: SESSION_SECRET });
  } catch {
    return {};
  }
}

async function createSetCookieHeader(
  data: SessionData,
  maxAge?: number,
): Promise<string> {
  const sealed = await sealData(data, { password: SESSION_SECRET });
  const parts = [
    `${SESSION_COOKIE}=${sealed}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
  ];
  if (maxAge !== undefined) {
    parts.push(`Max-Age=${maxAge}`);
  }
  if (import.meta.env.PROD) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export async function createDestroyCookieHeader(): Promise<string> {
  const parts = [
    `${SESSION_COOKIE}=`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0",
  ];
  if (import.meta.env.PROD) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getSessionData(request);
  return session.userId;
}

export async function getSessionInfo(
  request: Request,
): Promise<{ userId?: string; sessionVersion?: number }> {
  return getSessionData(request);
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  const { getUserById } = await import("./models/user.server");
  const user = await getUserById(userId);
  return user ?? null;
}

export async function createUserSession({
  userId,
  sessionVersion,
  remember,
  redirectTo,
}: {
  userId: string;
  sessionVersion: number;
  remember: boolean;
  redirectTo: string;
}): Promise<Response> {
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30 days or session
  const cookieHeader = await createSetCookieHeader(
    { userId, sessionVersion },
    maxAge,
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": cookieHeader,
    },
  });
}

export async function logout(): Promise<Response> {
  const cookieHeader = await createDestroyCookieHeader();
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": cookieHeader,
    },
  });
}
