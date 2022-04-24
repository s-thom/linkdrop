import type { Link, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

const LINK_QUERY_RESULTS_LIMIT = 50;

interface LinksByTagResult extends Link {
  tag_count: number;
  tags: string[];
}

async function getUserLinkIDsByTags({
  userId,
  tags,
  limit = LINK_QUERY_RESULTS_LIMIT,
}: {
  userId: User["id"];
  tags: string[];
  limit?: number;
}) {
  const results = await prisma.$queryRaw<LinksByTagResult[]>`
SELECT
  DISTINCT l.*,
  count(t.id) AS tag_count
FROM "Link" l
  JOIN "_LinkToTag" ltt ON ltt."A" = l.id 
  JOIN "Tag" t ON t.id = ltt."B" 
WHERE
  l."userId" = ${userId} 
  ${Prisma.sql`AND ${
    tags.length
      ? Prisma.sql`t."name" IN (${Prisma.join(tags)})`
      : Prisma.sql`true`
  }`}
GROUP BY l.id
ORDER BY tag_count DESC, l."createdAt" DESC
LIMIT ${Math.max(limit, LINK_QUERY_RESULTS_LIMIT)}
OFFSET 0
`;

  return results.map((link) => link.id);
}

export async function getUserLinksByTags({
  userId,
  tags,
  limit,
}: {
  userId: User["id"];
  tags: string[];
  limit?: number;
}) {
  const linkIds = await getUserLinkIDsByTags({ userId, tags, limit });

  const links = await prisma.link.findMany({
    include: { tags: true },
    where: {
      userId,
      id: { in: linkIds },
    },
  });

  return links.sort((a, b) => linkIds.indexOf(a.id) - linkIds.indexOf(b.id));
}

export function getSingleLink({ id }: { id: Link["id"] }) {
  return prisma.link.findFirst({
    include: { tags: true },
    where: {
      id,
    },
  });
}

export function createLink({
  url,
  description,
  userId,
}: Pick<Link, "url" | "description"> & {
  userId: User["id"];
}) {
  return prisma.link.create({
    data: {
      url,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteLink({
  id,
  userId,
}: Pick<Link, "id"> & { userId: User["id"] }) {
  return prisma.link.deleteMany({
    where: { id, userId },
  });
}
