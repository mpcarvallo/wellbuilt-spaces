import type { Snapshot } from "@/types/home-profile";
import { getResendClient, FROM_EMAIL, NOTIFY_EMAIL } from "@/lib/resend";
import { isValidEmail } from "@/lib/validate-email";
import {
  snapshotEmailSubject,
  snapshotEmailHtml,
  snapshotEmailText,
  snapshotRequestNotifySubject,
  snapshotRequestNotifyHtml,
} from "@/lib/email-templates";

export const runtime = "nodejs";

/** Just enough shape-checking to safely render the snapshot into an email. */
function isPlausibleSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  if (typeof s.intro !== "string" || typeof s.disclaimer !== "string") return false;
  if (!Array.isArray(s.topActions) || s.topActions.length === 0) return false;
  return s.topActions.every(
    (a) =>
      a &&
      typeof a === "object" &&
      typeof (a as Record<string, unknown>).title === "string" &&
      typeof (a as Record<string, unknown>).why === "string"
  );
}

export async function POST(req: Request): Promise<Response> {
  let email: unknown;
  let snapshot: unknown;
  try {
    const body = (await req.json()) as { email?: unknown; snapshot?: unknown };
    email = body.email;
    snapshot = body.snapshot;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!isPlausibleSnapshot(snapshot)) {
    return Response.json({ error: "Missing Snapshot data." }, { status: 400 });
  }

  const resend = getResendClient();
  if (!resend) {
    return Response.json(
      { error: "Email sending isn't configured yet." },
      { status: 503 }
    );
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: snapshotEmailSubject(),
      html: snapshotEmailHtml(snapshot),
      text: snapshotEmailText(snapshot),
    });
    if (error) {
      return Response.json({ error: "Could not send that email. Please try again." }, { status: 502 });
    }

    // Best-effort visibility for the site owner — never blocks or fails the visitor's request.
    if (NOTIFY_EMAIL) {
      resend.emails
        .send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: snapshotRequestNotifySubject(),
          html: snapshotRequestNotifyHtml(email),
        })
        .catch(() => {});
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not send that email. Please try again." }, { status: 502 });
  }
}
