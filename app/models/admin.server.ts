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
      links: {
        take: 1,
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAllUnusedInvites() {
  return prisma.userInvite.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      creatorUserId: true,
      inviteeUserId: true,
    },
    where: { inviteeUserId: { equals: null } },
    orderBy: { createdAt: "asc" },
  });
}
