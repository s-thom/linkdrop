import { useEffect, useRef, useState } from "react";
import SearchForm from "./SearchForm";
import LinkDisplay, { type LinkWithTags } from "./LinkDisplay";
import {
  useSearchFormState,
  formValuesToSearchParams,
} from "~/lib/util/useSearchFormState";

interface Props {
  initialLinks: LinkWithTags[];
  initialCommonTags: string[];
  userId: string;
}

export default function LinksIndex({
  initialLinks,
  initialCommonTags,
  userId,
}: Props) {
  const { values, addTag, removeTag } = useSearchFormState();
  const [links, setLinks] = useState<LinkWithTags[]>(initialLinks);
  const [commonTags, setCommonTags] = useState<string[]>(initialCommonTags);
  const hasMounted = useRef(false);

  useEffect(() => {
    // Skip the initial mount — SSR already fetched with the correct params.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const params = formValuesToSearchParams(values);
    fetch(`/links/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setLinks(data.links);
        setCommonTags(data.commonTags);
      });
  }, [values]);

  const activeTags = values.tags.map((t) => t.replace(/^[-+]/, ""));

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-80 md:pr-0">
        <SearchForm
          commonTags={commonTags}
          values={values}
          addTag={addTag}
          removeTag={removeTag}
        />
      </aside>
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        {links.length ? (
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <LinkDisplay
                  link={link}
                  activeTags={activeTags}
                  canShare
                  canEdit={userId === link.userId}
                  onTagClick={addTag}
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
              <a
                href="/links/new"
                className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
              >
                New link
              </a>{" "}
              link above to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
