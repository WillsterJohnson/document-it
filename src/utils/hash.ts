import crypto from "node:crypto";

/**
 * generate a SHA 256 hash from the given content string
 */
export function hash(content: string) {
  return crypto.createHash("sha256").update(content).digest("base64url");
}
