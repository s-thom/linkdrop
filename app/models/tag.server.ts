import type { Tag } from "@prisma/client";
import { prisma } from "~/db.server";

const TAGS_QUERY_RESULTS_LIMIT = 25;

export function getUserCommonTags({
  userId,
  exclude = [],
  limit = TAGS_QUERY_RESULTS_LIMIT,
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
    select: { id: true, name: true, _count: includeCount },
    orderBy: [{ links: { _count: "desc" } }, { name: "asc" }],
    take: Math.min(limit, TAGS_QUERY_RESULTS_LIMIT),
  });
}

export function getRelatedTags({
  userId,
  tags,
  limit = TAGS_QUERY_RESULTS_LIMIT,
}: {
  userId: Tag["id"];
  tags: string[];
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
  (t2.name = ANY(${tags})) = FALSE
GROUP BY t2.id
ORDER BY count(ltt2."B") DESC, t2."name"
LIMIT ${Math.min(limit, TAGS_QUERY_RESULTS_LIMIT)};
`;
}

export async function searchUserTags({
  userId,
  tags: tagsWithNegatives,
  limit = TAGS_QUERY_RESULTS_LIMIT,
}: {
  userId: Tag["id"];
  tags: string[];
  limit?: number;
}) {
  const tags = tagsWithNegatives.filter((tag) => !tag.startsWith("-"));

  const related = await getRelatedTags({ userId, tags, limit });

  if (related.length >= TAGS_QUERY_RESULTS_LIMIT) {
    return related;
  }

  const rest = await getUserCommonTags({
    userId,
    exclude: tags.concat(related.map((tag) => tag.name)),
    limit: limit - related.length,
  });

  return [...related, ...rest];
}
