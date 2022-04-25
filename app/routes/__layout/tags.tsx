import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getUserCommonTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { searchParamsToFormValues } from "~/util/useSearchFormState";

type LoaderData = {
  commonTags: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const commonTags = await getUserCommonTags({ userId, exclude: tags });

  return json<LoaderData>({
    commonTags: commonTags.map((tag) => tag.name),
  });
};
