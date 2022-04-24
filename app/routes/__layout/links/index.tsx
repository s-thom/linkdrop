import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import React from "react";
import LinkDisplay from "~/components/LinkDisplay";
import SearchForm from "~/components/SearchForm";
import { searchParamsToFormValues } from "~/util/useSearchFormState";
import { searchUserLinks } from "~/models/link.server";
import { getUserCommonTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const handle = { hydrate: true };

type LoaderData = {
  links: Awaited<ReturnType<typeof searchUserLinks>>;
  commonTags: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const [commonTags, links] = await Promise.all([
    getUserCommonTags({ userId, exclude: tags }),
    searchUserLinks({ userId, tags }),
  ]);

  return json<LoaderData>({
    links,
    commonTags: commonTags.map((tag) => tag.name),
  });
};

export default function LinksIndexPage() {
  const user = useUser();
  const data = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

  const { tags } = searchParamsToFormValues(searchParams);

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-80 md:pr-0">
        <SearchForm commonTags={data.commonTags} />
      </aside>

      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        {data.links.length ? (
          <ul>
            {data.links.map((link) => (
              <li key={link.id}>
                <LinkDisplay
                  link={link}
                  activeTags={tags}
                  canShare
                  canEdit={user.id === link.userId}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p className="mx-auto max-w-lg text-center text-xl lowercase sm:max-w-3xl">
              You haven't added any links yet.
            </p>
            <p className="mx-auto max-w-lg text-center text-xl lowercase sm:max-w-3xl">
              Click the{" "}
              <Link
                to="/links/new"
                className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
              >
                New link
              </Link>{" "}
              link above to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
