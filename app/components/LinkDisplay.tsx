import type { Link, Tag } from "@prisma/client";
import TagComponent from "./Tag";

interface LinkWithTags extends Link {
  tags: Tag[];
}

export interface LinkDisplayProps {
  link: LinkWithTags;
  activeTags?: string[];
}

export default function LinkDisplay({ link, activeTags }: LinkDisplayProps) {
  return (
    <div className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer nofollow"
        className="mb-2 block break-words text-xl font-normal text-link visited:text-link-visited hover:underline  active:text-link-active visited:active:text-link-active sm:text-2xl"
      >
        {link.url}
      </a>
      {link.description && (
        <p className="mb-2 break-words">{link.description}</p>
      )}
      <ul className="flex flex-wrap gap-2">
        {link.tags.map((tag) => (
          <li key={tag.id}>
            <TagComponent
              name={tag.name}
              disabled
              isActive={activeTags?.includes(tag.name)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
