import type { User, UserInvite } from "@prisma/client";
import { prisma } from "~/lib/db";

export async function createUserInvite({
  creator,
}: {
  creator: User["id"] | null;
}) {
  return prisma.userInvite.create({ data: { creatorUserId: creator } });
}

export async function getUserInvite({ id }: { id: UserInvite["id"] }) {
  return prisma.userInvite.findFirst({ where: { id } });
}

export async function getUserCreatedInvites({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.userInvite.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      invitee: { select: { id: true, email: true, createdAt: true } },
    },
    where: { creatorUserId: userId },
    orderBy: { createdAt: "asc" },
  });
}
