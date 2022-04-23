import type { Tag } from "@prisma/client";
import { prisma } from "~/db.server";

export function getUserCommonTags({ userId }: { userId: Tag["id"] }) {
  return prisma.tag.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: [{ links: { _count: "desc" } }, { name: "asc" }],
  });
}
