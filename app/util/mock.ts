import type { Tag } from "@prisma/client";
import type { LinkWithTags } from "~/components/LinkDisplay";

export function createTag(name: string): Tag {
  return {
    id: name,
    name,
    createdAt: new Date(),
    userId: "",
  };
}

export function createLink(
  url: string,
  description: string,
  tags: string[],
  sortOrder: number = 0
): LinkWithTags {
  return {
    id: "",
    url,
    createdAt: new Date(sortOrder),
    updatedAt: new Date(),
    description,
    tags: tags.map(createTag),
    userId: "",
  };
}

function reduceCountMatchingTags(input: Set<string>) {
  return (count: number, tag: Tag) => count + (input.has(tag.name) ? 1 : 0);
}

export function doMockSearch(
  links: LinkWithTags[],
  tags: string[]
): LinkWithTags[] {
  const tagSet = new Set(tags);

  return links
    .slice()
    .filter((link) => link.tags.some((tag) => tagSet.has(tag.name)))
    .sort((a, b) => {
      return (
        // Sort by number of matching tags desc
        b.tags.reduce(reduceCountMatchingTags(tagSet), 0) -
          a.tags.reduce(reduceCountMatchingTags(tagSet), 0) ||
        // Sort by date desc
        b.createdAt.getDate() - a.createdAt.getDate()
      );
    });
}
