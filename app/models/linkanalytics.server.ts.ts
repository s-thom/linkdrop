import type { Link, User } from "@prisma/client";
import { prisma } from "~/db.server";

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
