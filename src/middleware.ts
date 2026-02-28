import { defineMiddleware } from "astro:middleware";
import { getUserId } from "./lib/session";

const PROTECTED_PREFIXES = ["/links", "/user", "/admin", "/tags"];

export const onRequest = defineMiddleware(async (context, next) => {
  const userId = await getUserId(context.request);
  if (userId) {
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

  return next();
});
