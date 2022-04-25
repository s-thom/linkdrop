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
