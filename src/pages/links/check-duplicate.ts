import type { APIRoute } from "astro";
import { checkDuplicateLinks } from "~/lib/models/link.server";

export const GET: APIRoute = async ({ request, locals }) => {
  const userId = locals.userId;
  if (!userId) {
    return new Response(JSON.stringify({ duplicateLinkIds: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const requestUrl = new URL(request.url);
  const url = requestUrl.searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ duplicateLinkIds: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const duplicates = await checkDuplicateLinks({ userId, url });

  return new Response(
    JSON.stringify({ duplicateLinkIds: duplicates.map((link) => link.id) }),
    { headers: { "Content-Type": "application/json" } },
  );
};
