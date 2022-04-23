import type { Link, Tag } from "@prisma/client";

interface LinkWithTags extends Link {
  tags: Tag[];
}

export interface LinkDisplayProps {
  link: LinkWithTags;
}

export default function LinkDisplay({ link }: LinkDisplayProps) {
  return (
    <div className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer nofollow"
        className="mb-2 block break-words text-2xl font-normal text-link visited:text-link-visited  hover:underline active:text-link-active visited:active:text-link-active"
      >
        {link.url}
      </a>
      {link.description && (
        <p className="mb-2 break-words">{link.description}</p>
      )}
      <ul className="flex flex-wrap gap-2">
        {link.tags.map((tag) => (
          <li
            key={tag.id}
            className="inline-block rounded border bg-neutral-100 py-0 px-2 text-neutral-600 hover:text-black"
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
