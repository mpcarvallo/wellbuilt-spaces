import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "wellbuilt_admin_session";
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function secret(): string {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** True if the given password matches ADMIN_PASSWORD (which must be configured). */
export function checkPassword(password: string): boolean {
  const expected = secret();
  if (!expected) return false;
  return safeEqual(password, expected);
}

/** Builds a signed session token embedding its own expiry. */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_LIFETIME_MS;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

/** Verifies a session token's signature and expiry. */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [expiresAtStr, signature] = token.split(".");
  if (!expiresAtStr || !signature) return false;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return safeEqual(sign(expiresAtStr), signature);
}
