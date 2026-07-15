import { describe, it, expect } from "vitest";
import { isValidEmail } from "@/lib/validate-email";

describe("isValidEmail", () => {
  it("accepts plausible email addresses", () => {
    expect(isValidEmail("paulina@wellbuilt-spaces.com")).toBe(true);
    expect(isValidEmail("a@b.co")).toBe(true);
  });

  it("rejects non-strings", () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail(["a@b.com"])).toBe(false);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("missing-domain@")).toBe(false);
    expect(isValidEmail("@missing-local.com")).toBe(false);
    expect(isValidEmail("has spaces@example.com")).toBe(false);
  });

  it("rejects absurdly long input", () => {
    const long = `${"a".repeat(250)}@example.com`;
    expect(isValidEmail(long)).toBe(false);
  });
});
