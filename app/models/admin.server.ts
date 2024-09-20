import { prisma } from "~/db.server";

export async function getAllUsersSummary() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      totp: { select: { active: true } },
      _count: { select: { links: true, tags: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
