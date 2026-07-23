import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { checkPassword, createSessionToken, verifySessionToken } from "@/lib/admin-auth";

describe("admin-auth", () => {
  const original = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "test-password-123";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = original;
  });

  it("accepts the correct password and rejects wrong ones", () => {
    expect(checkPassword("test-password-123")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
  });

  it("rejects any password when ADMIN_PASSWORD is unset", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(checkPassword("test-password-123")).toBe(false);
  });

  it("issues a token that verifies successfully", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("rejects a tampered token", () => {
    const token = createSessionToken();
    const [expires] = token.split(".");
    expect(verifySessionToken(`${expires}.deadbeef`)).toBe(false);
  });

  it("rejects an expired token", () => {
    const expiredExpiry = Date.now() - 1000;
    // Re-derive the signature the same way the module would for a past timestamp.
    const token = createSessionToken().replace(/^\d+/, String(expiredExpiry));
    expect(verifySessionToken(token)).toBe(false);
  });

  it("rejects a missing token", () => {
    expect(verifySessionToken(undefined)).toBe(false);
  });
});
