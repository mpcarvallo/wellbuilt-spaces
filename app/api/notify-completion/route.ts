import type { Answers } from "@/types/questionnaire";
import { getResendClient, FROM_EMAIL, NOTIFY_EMAIL } from "@/lib/resend";
import { completionNotifySubject, completionNotifyHtml } from "@/lib/email-templates";

export const runtime = "nodejs";

/**
 * Best-effort visibility notification: fired once per completed questionnaire,
 * whether or not the visitor ever gives an email. Never blocks or affects the
 * visitor's own results — the client fires this without awaiting the result.
 */
export async function POST(req: Request): Promise<Response> {
  let answers: unknown;
  try {
    const body = (await req.json()) as { answers?: unknown };
    answers = body.answers;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return Response.json({ error: "Invalid answers" }, { status: 400 });
  }

  const resend = getResendClient();
  if (!resend || !NOTIFY_EMAIL) {
    // Not configured — a no-op, not an error worth surfacing anywhere.
    return Response.json({ ok: false }, { status: 200 });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: completionNotifySubject(),
      html: completionNotifyHtml(answers as Answers),
    });
  } catch {
    // Best-effort only — never surfaces to the visitor.
  }

  return Response.json({ ok: true });
}
