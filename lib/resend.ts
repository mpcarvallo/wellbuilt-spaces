import { Resend } from "resend";

const DEFAULT_FROM = "WellBuilt Spaces <onboarding@resend.dev>";

/** Returns a configured Resend client, or null if no API key is set (safe to no-op in dev). */
export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

/** Address that receives waitlist signup notifications. Required to accept waitlist joins. */
export const NOTIFY_EMAIL = process.env.RESEND_NOTIFY_EMAIL || "";
