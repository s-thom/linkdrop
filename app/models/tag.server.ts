import type { Tag } from "@prisma/client";
import { prisma } from "~/db.server";
import { splitMap } from "~/util/array";

export const ALL_TAGS_LIMIT = 500;
export const COMMON_TAGS_LIMIT = 25;

export function getUserTags({
  userId,
  limit = ALL_TAGS_LIMIT,
}: {
  userId: Tag["id"];
  limit?: number;
}) {
  return prisma.tag.findMany({
    where: {
      userId,
    },
    select: { id: true, name: true },
    orderBy: [{ name: "asc" }],
    take: Math.min(limit, ALL_TAGS_LIMIT),
  });
}

export function getUserTag({
  userId,
  name,
}: {
  userId: Tag["id"];
  name: Tag["name"];
}) {
  return prisma.tag.findFirst({
    where: {
      userId,
      name,
    },
    select: { id: true, name: true },
  });
}

export function renameUserTag({
  userId,
  tagId,
  newName,
}: {
  userId: Tag["userId"];
  tagId: Tag["id"];
  newName: Tag["name"];
}) {
  return prisma.tag.update({
    where: { userId, id: tagId },
    data: { name: newName },
  });
}

export function getUserCommonTags({
  userId,
  exclude = [],
  limit = COMMON_TAGS_LIMIT,
  includeCount,
}: {
  userId: Tag["id"];
  exclude?: string[];
  limit?: number;
  includeCount?: boolean;
}) {
  return prisma.tag.findMany({
    where: {
      userId,
      NOT: { name: { in: exclude } },
    },
    select: { id: true, name: true, _count: !!includeCount },
    orderBy: [{ links: { _count: "desc" } }, { name: "asc" }],
    take: Math.min(limit, COMMON_TAGS_LIMIT),
  });
}

export function getRelatedTags({
  userId,
  tags,
  exclude,
  limit = COMMON_TAGS_LIMIT,
}: {
  userId: Tag["id"];
  tags: string[];
  exclude: string[];
  limit?: number;
}) {
  return prisma.$queryRaw<Tag[]>`
SELECT
  t2.*
FROM "Tag" t
  JOIN "_LinkToTag" ltt ON ltt."B" = t.id
  JOIN "_LinkToTag" ltt2 ON
    ltt2."A" = ltt."A" AND
    ltt2."B" != ltt."B"
  JOIN "Tag" t2 ON t2.id = ltt2."B"
WHERE
  t."userId" = ${userId} AND
  t.name = ANY(${tags}) AND
  (t2.name = ANY(${tags})) = FALSE AND
  (t2.name = ANY(${exclude})) = FALSE
GROUP BY t2.id
ORDER BY count(ltt2."B") DESC, t2."name"
LIMIT ${Math.min(limit, COMMON_TAGS_LIMIT)};
`;
}

export async function searchUserTags({
  userId,
  tags: tagsWithNegatives,
  limit = COMMON_TAGS_LIMIT,
}: {
  userId: Tag["id"];
  tags: string[];
  limit?: number;
}) {
  const { include, exclude } = splitMap(
    tagsWithNegatives,
    (tag) => !tag.startsWith("-"),
    (tag) => tag.replace(/^(-)/, ""),
  );

  const related = await getRelatedTags({
    userId,
    tags: include,
    exclude,
    limit,
  });

  if (related.length >= COMMON_TAGS_LIMIT) {
    return related;
  }

  const rest = await getUserCommonTags({
    userId,
    exclude: ([] as string[]).concat(
      include,
      exclude,
      related.map((tag) => tag.name),
    ),
    limit: limit - related.length,
  });

  return [...related, ...rest];
}
