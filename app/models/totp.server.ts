import type { User } from "@prisma/client";
import { authenticator } from "otplib";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { decode, encode } from "~/util/aes.server";

invariant(process.env.TOTP_SECRET, "TOTP_SECRET must be set");

export function encodeTotpSecret(cleartext: string) {
  return encode(cleartext, process.env.TOTP_SECRET!);
}

export function decodeTotpSecret(ciphertext: string) {
  return decode(ciphertext, process.env.TOTP_SECRET!);
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
