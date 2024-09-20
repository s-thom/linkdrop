import type { User, UserInvite } from "@prisma/client";
import { prisma } from "~/db.server";

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
