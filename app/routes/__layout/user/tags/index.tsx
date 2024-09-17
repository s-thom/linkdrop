import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import Tag from "~/components/Tag";
import { getUserTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";

interface LoaderData {
  tags: { id: string; name: string }[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const tags = await getUserTags({ userId });

  return json<LoaderData>({ tags });
};

export default function TagsIndexPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Edit tags</h2>

      <p>Review and organise your tags.</p>

      <ul className="flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <li key={tag.id}>
            <Link to={`/user/tags/${encodeURI(tag.name)}`}>
              <Tag
                name={`${tag.name}`}
                className="cursor-pointer"
                state="inactive"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
