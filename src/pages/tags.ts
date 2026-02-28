import type { APIRoute } from "astro";
import { searchUserTags } from "~/lib/models/tag.server";
import { searchParamsToFormValues } from "~/lib/util/useSearchFormState";

export const GET: APIRoute = async ({ request, locals }) => {
  const userId = locals.userId;
  if (!userId) {
    return new Response(JSON.stringify({ commonTags: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const commonTags = await searchUserTags({ userId, tags });

  return new Response(
    JSON.stringify({ commonTags: commonTags.map((tag) => tag.name) }),
    { headers: { "Content-Type": "application/json" } },
  );
};
