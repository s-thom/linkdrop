import type { APIRoute } from "astro";
import { getSingleLink } from "~/lib/models/link.server";
import { incrementUserLinkClicks } from "~/lib/models/linkanalytics.server";

export const POST: APIRoute = async ({ params, locals }) => {
  const userId = locals.userId;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const link = await getSingleLink({ id });
  if (!link || link.userId !== userId) {
    return new Response("Not Found", { status: 404 });
  }

  await incrementUserLinkClicks({ userId, linkId: id });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
