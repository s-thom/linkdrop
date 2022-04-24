import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import LinkDisplay from "~/components/LinkDisplay";
import SearchForm from "~/components/SearchForm";
import { searchParamsToFormValues } from "~/util/useSearchFormState";
import { getUserLinksByTags } from "~/models/link.server";
import { getUserCommonTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";

export const handle = { hydrate: true };

type LoaderData = {
  links: Awaited<ReturnType<typeof getUserLinksByTags>>;
  commonTags: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const [commonTags, links] = await Promise.all([
    getUserCommonTags({ userId }),
    getUserLinksByTags({ userId, tags }),
  ]);

  return json<LoaderData>({
    links,
    commonTags: commonTags.map((tag) => tag.name),
  });
};

export default function LinksIndexPage() {
  const data = useLoaderData<LoaderData>();

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
                <LinkDisplay link={link} />
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
