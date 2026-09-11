import { randomBytes } from "crypto";

// Generates a URL-safe random token for invite links.
// 32 bytes = 256 bits of entropy = unguessable.
export function generateInviteToken(): string {
  return randomBytes(32).toString("base64url");
}
