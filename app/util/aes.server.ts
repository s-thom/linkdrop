import {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";
import { Buffer } from "node:buffer";

// Refs: https://github.com/brix/crypto-js/issues/468#issuecomment-2060562277
export function encode(cleartext: string, key: string): string {
  const salt = randomBytes(8);
  const password = Buffer.concat([Buffer.from(key), salt]);
  const hash = [];
  let digest = password;
  for (let i = 0; i < 3; i++) {
    hash[i] = createHash("md5").update(digest).digest();
    digest = Buffer.concat([hash[i], password]);
  }
  const keyDerivation = Buffer.concat(hash);
  const encKey = keyDerivation.subarray(0, 32);
  const iv = keyDerivation.subarray(32);
  const cipher = createCipheriv("aes-256-cbc", encKey, iv);
  return Buffer.concat([
    Buffer.from("Salted__", "utf8"),
    salt,
    cipher.update(cleartext),
    cipher.final(),
  ]).toString("base64");
}

// Refs: https://github.com/brix/crypto-js/issues/468#issuecomment-1783351942
export function decode(ciphertext: string, key: string): string {
  // From https://gist.github.com/schakko/2628689?permalink_comment_id=3321113#gistcomment-3321113
  // From https://gist.github.com/chengen/450129cb95c7159cb05001cc6bdbf6a1
  const cypher = Buffer.from(ciphertext, "base64");
  const salt = cypher.slice(8, 16);
  const password = Buffer.concat([Buffer.from(key), salt]);
  const md5Hashes = [];
  let digest = password;
  for (let i = 0; i < 3; i++) {
    md5Hashes[i] = createHash("md5").update(digest).digest();
    digest = Buffer.concat([md5Hashes[i], password]);
  }
  const encKey = Buffer.concat([md5Hashes[0], md5Hashes[1]]);
  const iv = md5Hashes[2];
  const contents = cypher.slice(16);
  const decipher = createDecipheriv("aes-256-cbc", encKey, iv);

  return Buffer.concat([decipher.update(contents), decipher.final()]).toString(
    "utf8",
  );
}
