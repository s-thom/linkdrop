import type { Link, Tag } from "@prisma/client";
import { Link as LinkComponent } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { Edit3, Link as LinkIcon } from "lucide-react";
import TagComponent from "./Tag";

export interface LinkWithTags extends SerializeFrom<Link> {
  tags: SerializeFrom<Tag>[];
}

export interface LinkDisplayProps {
  link: LinkWithTags;
  activeTags?: string[];
  canShare?: boolean;
  canEdit?: boolean;
  onLinkClick?: () => void;
  onTagClick?: (tag: string) => void;
}

export default function LinkDisplay({
  link,
  activeTags,
  canShare,
  canEdit,
  onLinkClick,
  onTagClick,
}: LinkDisplayProps) {
  const shouldShowIcons = canShare || canEdit;

  return (
    <div className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer nofollow"
        className="mb-2 block break-words text-xl font-normal text-link visited:text-link-visited hover:underline active:text-link-active visited:active:text-link-active sm:text-2xl"
        onClick={onLinkClick}
      >
        {link.url}
      </a>
      <div className="flex">
        <div className="w-0 flex-1">
          {link.description && (
            <p className="mb-2 overflow-hidden text-ellipsis break-words">
              {link.description}
            </p>
          )}
          <ul className="flex flex-wrap gap-2">
            {link.tags.map((tag) => (
              <li key={tag.id}>
                <TagComponent
                  name={tag.name}
                  disabled={!onTagClick}
                  state={activeTags?.includes(tag.name) ? "active" : "inactive"}
                  onClick={onTagClick && (() => onTagClick(tag.name))}
                />
              </li>
            ))}
          </ul>
        </div>
        {shouldShowIcons && (
          <div className="jusify-end -mr-2 flex flex-col justify-end">
            {canShare && (
              <LinkComponent
                className="p-1 text-neutral-400 hover:text-neutral-600"
                to={`/links/${link.id}`}
              >
                <LinkIcon className="h-5 w-5" aria-label="Permalink" />
              </LinkComponent>
            )}
            {canEdit && (
              <LinkComponent
                className="p-1 text-neutral-400 hover:text-neutral-600"
                to={`/links/${link.id}/edit`}
              >
                <Edit3 className="h-5 w-5" aria-label="Edit link" />
              </LinkComponent>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
