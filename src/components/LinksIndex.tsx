import { useCallback, useEffect, useRef, useState } from "react";
import SearchForm from "./SearchForm";
import LinkDisplay, { type LinkWithTags } from "./LinkDisplay";
import {
  useSearchFormState,
  formValuesToSearchParams,
} from "~/lib/util/useSearchFormState";
import { useEventCallback } from "~/lib/util/analytics";

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
    [sendLinkClick],
  );

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
    <div className="page-layout">
      <aside className="sidebar wide">
        <SearchForm
          commonTags={commonTags}
          values={values}
          addTag={addTag}
          removeTag={removeTag}
        />
      </aside>
      <main className="page-main">
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
                  onLinkClick={() => onLinkClick(link.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p className="lead">You haven't added any links yet.</p>
            <p className="lead">
              Click the{" "}
              <a href="/links/new" className="nav-link">
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
