import type { User } from "@prisma/client";
import { authenticator } from "otplib";
import { prisma } from "~/lib/db";
import { decode, encode } from "~/lib/util/aes.server";
import { TOTP_SECRET } from "astro:env/server";

authenticator.options = { window: 1 };

export function encodeTotpSecret(cleartext: string) {
  return encode(cleartext, TOTP_SECRET);
}

export function decodeTotpSecret(ciphertext: string) {
  return decode(ciphertext, TOTP_SECRET);
}

export function validateTotp(token: string, ciphertext: string) {
  const secret = decodeTotpSecret(ciphertext);
  return authenticator.check(token, secret);
}

export function getUserTotp(userId: User["id"]) {
  return prisma.totp.findUnique({ where: { userId } });
}

export function generateNewTotpSecret() {
  return authenticator.generateSecret();
}

export function createUserTotp(userId: User["id"], secret: string) {
  const encryptedSecret = encodeTotpSecret(secret);
  return prisma.totp.create({
    data: {
      userId,
      secret: encryptedSecret,
      active: false,
    },
  });
}

export function setUserTotpActive(userId: User["id"]) {
  return prisma.totp.update({
    where: { userId },
    data: { active: true },
  });
}

export function deleteUserTotp(userId: User["id"]) {
  return prisma.totp.delete({ where: { userId } });
}
