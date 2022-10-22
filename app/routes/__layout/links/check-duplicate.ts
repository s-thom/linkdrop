import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { checkDuplicateLinks } from "~/models/link.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  duplicateLinkIds: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const requestUrl = new URL(request.url);
  const url = requestUrl.searchParams.get("url");

  if (!url) {
    return json<LoaderData>({
      duplicateLinkIds: [],
    });
  }

  const duplicates = await checkDuplicateLinks({ userId, url });

  return json<LoaderData>({
    duplicateLinkIds: duplicates.map((link) => link.id),
  });
};
