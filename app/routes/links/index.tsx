import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserLinksByTags } from "~/models/link.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  links: Awaited<ReturnType<typeof getUserLinksByTags>>;
  tags: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const tagsRaw = url.searchParams.get("tags");
  const tags = decodeURIComponent(tagsRaw ?? "")
    .split(",")
    .filter(Boolean);

  const links = await getUserLinksByTags({ userId, tags });
  return json<LoaderData>({ links, tags });
};

export default function NoteIndexPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      hello world
      <ul>
        {data.links.map((link) => (
          <li key={link.id}>
            {link.url}: {link.tags.map((t) => t.name).join(",")}
          </li>
        ))}
      </ul>
    </>
  );
}
