import type { Link, Tag, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

const LINK_QUERY_RESULTS_LIMIT = 50;

interface LinksByTagResult extends Link {
  tag_count: number;
  tags: string[];
}

export async function searchUserLinks({
  userId,
  tags,
  limit = LINK_QUERY_RESULTS_LIMIT,
}: {
  userId: User["id"];
  tags: string[];
  limit?: number;
}) {
  const trueLimit = Math.max(limit, LINK_QUERY_RESULTS_LIMIT);

  // Since this is a bit more of a complicated query, it's split into a couple of sections.
  // It involved re-querying data and sorting in-memory, which is why there is a limit in place.
  const results = await prisma.$queryRaw<LinksByTagResult[]>`
SELECT
  DISTINCT l.*,
  count(t.id) AS tag_count
FROM "Link" l
  JOIN "_LinkToTag" ltt ON ltt."A" = l.id 
  LEFT JOIN "Tag" t ON
    t.id = ltt."B" AND
    ${Prisma.sql([tags.length ? "true" : "false"])}
WHERE
  l."userId" = ${userId} AND
  ${Prisma.sql`${
    tags.length
      ? Prisma.sql`t."name" IN (${Prisma.join(tags)})`
      : Prisma.sql`true`
  }`}
GROUP BY l.id
ORDER BY tag_count DESC, l."createdAt" DESC
LIMIT ${trueLimit}
OFFSET 0
`;
  const sortedLinkIds = results.map((link) => link.id);

  // Now we have the IDs, get the objects for real.
  // Yes, this is effectively querying the same information again.
  const links = await prisma.link.findMany({
    include: { tags: true },
    where: {
      userId,
      id: { in: sortedLinkIds },
    },
  });

  // The list from the findMany is not in the correct order, so it must be sorted in-memory.
  links.sort(
    (a, b) => sortedLinkIds.indexOf(a.id) - sortedLinkIds.indexOf(b.id)
  );

  return links;
}

export function getSingleLink({ id }: { id: Link["id"] }) {
  return prisma.link.findFirst({
    include: { tags: true },
    where: {
      id,
    },
  });
}

export async function createLink({
  url,
  description,
  userId,
  tags,
}: Pick<Link, "url" | "description"> & {
  userId: User["id"];
  tags: string[];
}) {
  const tagModels = await prisma.tag.findMany({
    where: {
      name: { in: tags },
      userId: { equals: userId },
    },
  });
  const tagMap = tagModels.reduce<Record<string, Tag | undefined>>(
    (map, tag) => {
      map[tag.name] = tag;
      return map;
    },
    {}
  );

  return prisma.link.create({
    data: {
      url,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: {
            id:
              tagMap[tag]?.id ??
              "this string should never be used as an identifier",
          },
          create: { name: tag, userId },
        })),
      },
    },
  });
}

export async function editLink({
  id,
  url,
  description,
  userId,
  tags,
}: Pick<Link, "id" | "url" | "description"> & {
  userId: User["id"];
  tags: string[];
}) {
  // Ensure the link exists already. This is also used for updating the tags correctly.
  const currentLink = await prisma.link.findFirst({
    where: { id },
    include: { tags: true },
  });
  if (!currentLink || currentLink.userId !== userId) {
    throw new Error("Link does not exist");
  }

  // Try fetch all of the tags the user wants to add, so the connect behaviour is correct
  const tagModels = await prisma.tag.findMany({
    where: {
      name: { in: tags },
      userId: { equals: userId },
    },
  });
  const tagMap = tagModels.reduce<Record<string, Tag | undefined>>(
    (map, tag) => {
      map[tag.name] = tag;
      return map;
    },
    {}
  );

  // Determine which tags to add/remove
  const currentTagNames = currentLink.tags.map((tag) => tag.name);
  const tagsToConnect = tags.filter((tag) => !currentTagNames.includes(tag));
  const tagsToDisconnect = currentLink.tags
    .filter((tag) => !tags.includes(tag.name))
    .map((tag) => ({ id: tag.id }));

  return prisma.link.update({
    where: { id },
    data: {
      url,
      description,
      tags: {
        connectOrCreate: tagsToConnect.map((tag) => ({
          where: {
            id:
              tagMap[tag]?.id ??
              "this string should never be used as an identifier",
          },
          create: { name: tag, userId },
        })),
        disconnect: tagsToDisconnect,
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
