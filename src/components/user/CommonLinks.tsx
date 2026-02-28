import { useCallback } from "react";
import type { getUserMostClickedLinks } from "~/lib/models/linkanalytics.server";
import { useEventCallback } from "~/lib/util/analytics";

export interface CommonLinksProps {
  commonLinks: Awaited<ReturnType<typeof getUserMostClickedLinks>>;
}

export function CommonLinks({ commonLinks }: CommonLinksProps) {
  const sendLinkClick = useEventCallback({
    name: "common-link",
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

  return (
    <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
      <h3 className="mb-2 block break-words text-xl font-normal lowercase">
        Most commonly clicked links
      </h3>
      <p className="mb-2 break-words">
        These are the links you keep coming back to:
      </p>
      <ul className="flex flex-wrap gap-2">
        {commonLinks.map(({ link, clicks }) => (
          <li key={link.id} className="list-inside list-disc">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer nofollow"
              className="mb-2 break-all font-normal text-link visited:text-link-visited hover:underline active:text-link-active visited:active:text-link-active"
              onClick={() => onLinkClick(link.id)}
            >
              {link.url}
            </a>
            {` (${clicks})`}
          </li>
        ))}
      </ul>
    </section>
  );
}
