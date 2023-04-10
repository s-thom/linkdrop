import type { Link, User } from "@prisma/client";
import { prisma } from "~/db.server";

const COMMON_LINKS_QUERY_RESULTS_LIMIT = 5;

export async function incrementUserLinkClicks({
  userId,
  linkId,
}: {
  userId: User["id"];
  linkId: Link["id"];
}) {
  return prisma.linkAnalytics.upsert({
    where: { linkId },
    create: {
      clicks: 1,
      linkId,
      userId,
    },
    update: { clicks: { increment: 1 } },
  });
}

export async function getUserMostClickedLinks({
  userId,
  limit = COMMON_LINKS_QUERY_RESULTS_LIMIT,
}: {
  userId: User["id"];
  limit?: number;
}) {
  const results = await prisma.linkAnalytics.findMany({
    where: {
      userId,
    },
    include: { link: { include: { tags: { orderBy: { name: "asc" } } } } },
    orderBy: {
      clicks: "desc",
    },
    take: limit,
  });

  return results.map((result) => ({
    link: result.link,
    clicks: result.clicks,
  }));
}
