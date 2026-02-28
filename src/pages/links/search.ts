import type { APIRoute } from "astro";
import { searchUserLinks } from "~/lib/models/link.server";
import { searchUserTags } from "~/lib/models/tag.server";
import { searchParamsToFormValues } from "~/lib/util/useSearchFormState";

export const GET: APIRoute = async ({ request, locals }) => {
  const userId = locals.userId;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const [commonTags, links] = await Promise.all([
    searchUserTags({ userId, tags }),
    searchUserLinks({ userId, tags }),
  ]);

  return new Response(
    JSON.stringify({ links, commonTags: commonTags.map((t) => t.name) }),
    { headers: { "Content-Type": "application/json" } },
  );
};
