import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import LinkDisplay from "~/components/LinkDisplay";
import SearchForm from "~/components/SearchForm";
import { searchUserLinks } from "~/models/link.server";
import { searchUserTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";
import {
  searchParamsToFormValues,
  useSearchFormState,
} from "~/util/useSearchFormState";
import { useUser } from "~/utils";

type LoaderData = {
  links: Awaited<ReturnType<typeof searchUserLinks>>;
  commonTags: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const [commonTags, links] = await Promise.all([
    searchUserTags({ userId, tags }),
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

  const { values, addTag, removeTag } = useSearchFormState();

  const toggleTag = useCallback(
    (tag: string) => {
      values.tags.includes(tag) ? removeTag(tag) : addTag(tag);
    },
    [addTag, removeTag, values.tags]
  );

  const activeTags = useMemo(() => {
    return values.tags.map((tag) => tag.replace(/^[-+]/, ""));
  }, [values.tags]);

  const sendLinkClick = useEventCallback({
    name: "link",
    data: { type: "click" },
  });
  const onLinkClick = useCallback(
    (linkId: string) => {
      const formData = new FormData();
      formData.append("type", "click");
      navigator.sendBeacon(`/links/${linkId}/on`, formData);
      sendLinkClick();
    },
    [sendLinkClick]
  );

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-80 md:pr-0">
        <SearchForm
          commonTags={data.commonTags}
          values={values}
          addTag={addTag}
          removeTag={removeTag}
        />
      </aside>

      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        {data.links.length ? (
          <ul>
            {data.links.map((link) => (
              <li key={link.id}>
                <LinkDisplay
                  link={link}
                  activeTags={activeTags}
                  canShare
                  canEdit={user.id === link.userId}
                  onLinkClick={() => onLinkClick(link.id)}
                  onTagClick={toggleTag}
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
