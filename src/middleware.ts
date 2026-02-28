import { defineMiddleware } from "astro:middleware";
import { getSessionInfo, createDestroyCookieHeader } from "./lib/session";
import {
  ensureCsrfToken,
  csrfCookieHeader,
  validateCsrf,
} from "./lib/util/csrf.server";
import { prisma } from "./lib/db";

const PROTECTED_PREFIXES = ["/links", "/user", "/admin", "/tags"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { userId, sessionVersion } = await getSessionInfo(context.request);

  if (userId) {
    // Validate session version against DB to catch password changes and deleted users
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { sessionVersion: true },
    });

    if (!dbUser || dbUser.sessionVersion !== sessionVersion) {
      const destroyCookie = await createDestroyCookieHeader();
      return new Response(null, {
        status: 302,
        headers: { Location: "/login", "Set-Cookie": destroyCookie },
      });
    }

    context.locals.userId = userId;
  }

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    context.url.pathname.startsWith(p),
  );
  if (isProtected && !userId) {
    return context.redirect(
      `/login?redirectTo=${encodeURIComponent(context.url.pathname)}`,
    );
  }

  // CSRF validation for all protected POST requests
  if (isProtected && context.request.method === "POST") {
    const formData = await context.request.clone().formData();
    if (!validateCsrf(context.request, formData)) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  // Ensure CSRF cookie is set for authenticated GET requests
  if (userId && context.request.method === "GET") {
    const { token, isNew } = ensureCsrfToken(context.request);
    if (isNew) {
      const response = await next();
      response.headers.append("Set-Cookie", csrfCookieHeader(token));
      return response;
    }
  }

  return next();
});
