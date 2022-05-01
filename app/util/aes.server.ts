import { AES, enc } from "crypto-js";

export function encode(cleartext: string, key: string): string {
  return AES.encrypt(cleartext, key).toString();
}

export function decode(ciphertext: string, key: string): string {
  return AES.decrypt(ciphertext, key).toString(enc.Utf8);
}
