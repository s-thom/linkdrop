import type { Password, Totp, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { decode, encode } from "~/util/aes.server";
import { getUserCommonTags } from "./tag.server";

invariant(process.env.TOTP_SECRET, "TOTP_SECRET must be set");

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUserPassword({
  userId,
  password,
}: {
  userId: User["id"];
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.password.update({
    where: { userId },
    data: { hash: hashedPassword },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function getUserSummary(userId: User["id"]) {
  const [user, numLinks, commonTags] = await Promise.all([
    getUserById(userId),
    prisma.link.count({ where: { userId } }),
    getUserCommonTags({ userId, includeCount: true }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  return { user, numLinks, commonTags };
}

export async function getUser2faMethods(
  userId: User["id"]
): Promise<{ totp: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      totp: true,
    },
  });

  return {
    totp: !!user?.totp,
  };
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
  totp: Totp["secret"]
): Promise<
  | {
      success: false;
      errorType: "password_incorrect" | "requires_2fa" | "totp_incorrect";
    }
  | { success: true; user: User }
> {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
      totp: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return { success: false, errorType: "password_incorrect" };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isPasswordValid) {
    return { success: false, errorType: "password_incorrect" };
  }

  if (userWithPassword.totp) {
    if (!totp) {
      return { success: false, errorType: "requires_2fa" };
    }

    const secret = decode(
      userWithPassword.totp.secret,
      process.env.TOTP_SECRET!
    );
    const isTotpValid = authenticator.check(totp, secret);
    if (!isTotpValid) {
      return { success: false, errorType: "totp_incorrect" };
    }
  }

  const {
    password: _password,
    totp: _totp,
    ...userWithoutPassword
  } = userWithPassword;

  return { success: true, user: userWithoutPassword };
}

export function setUserTotp(userId: User["id"], secret: string) {
  const encryptedSecret = encode(secret, process.env.TOTP_SECRET!);
  return prisma.totp.create({ data: { userId, secret: encryptedSecret } });
}

export function deleteUserTotp(userId: User["id"]) {
  return prisma.totp.delete({ where: { userId } });
}
