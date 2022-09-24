import type { Tag } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/server-runtime";
import type { LinkWithTags } from "~/components/LinkDisplay";

export function createTag(name: string): SerializeFrom<Tag> {
  return {
    id: name,
    name,
    createdAt: new Date().toISOString(),
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
    id: url,
    url,
    createdAt: new Date(sortOrder).toISOString(),
    updatedAt: new Date().toISOString(),
    description,
    tags: tags.map(createTag),
    userId: "",
  };
}

function reduceCountMatchingTags(input: Set<string>) {
  return (count: number, tag: SerializeFrom<Tag>) =>
    count + (input.has(tag.name) ? 1 : 0);
}

export function doMockSearch(
  links: LinkWithTags[],
  tags: string[]
): LinkWithTags[] {
  const tagSet = new Set(tags);
  const negativeSet = new Set(
    tags
      .filter((tag) => tag.startsWith("-"))
      .map((tag) => tag.replace(/^-/, ""))
  );
  const positiveSet = new Set(
    tags
      .filter((tag) => tag.startsWith("+"))
      .map((tag) => tag.replace(/^\+/, ""))
  );
  // Make sur to include positive tags in the tag set
  positiveSet.forEach((tag) => tagSet.add(tag));

  return links
    .slice()
    .filter((link) => link.tags.some((tag) => tagSet.has(tag.name)))
    .filter(
      (link) =>
        positiveSet.size === 0 ||
        link.tags.some((tag) => positiveSet.has(tag.name))
    )
    .filter(
      (link) =>
        negativeSet.size === 0 ||
        !link.tags.some((tag) => negativeSet.has(tag.name))
    )
    .sort((a, b) => {
      return (
        // Sort by number of matching tags desc
        b.tags.reduce(reduceCountMatchingTags(tagSet), 0) -
          a.tags.reduce(reduceCountMatchingTags(tagSet), 0) ||
        // Sort by date desc
        new Date(b.createdAt).getDate() - new Date(a.createdAt).getDate()
      );
    });
}
