import type { Answers } from "@/types/questionnaire";
import { isValidEmail } from "@/lib/validate-email";
import { isDbConfigured, insertSubmission } from "@/lib/db";
import { getResendClient, FROM_EMAIL, NOTIFY_EMAIL } from "@/lib/resend";
import { completionNotifySubject, completionNotifyHtml } from "@/lib/email-templates";

export const runtime = "nodejs";

function newId(): string {
  return crypto.randomUUID();
}

/**
 * Fired once per completed questionnaire. Stores the full response (so the
 * site owner can review it on /admin) and best-effort sends an immediate
 * email notification on top — neither blocks the visitor's own results.
 */
export async function POST(req: Request): Promise<Response> {
  let email: unknown;
  let answers: unknown;
  try {
    const body = (await req.json()) as { email?: unknown; answers?: unknown };
    email = body.email;
    answers = body.answers;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return Response.json({ error: "Invalid answers" }, { status: 400 });
  }

  if (isDbConfigured()) {
    try {
      await insertSubmission(newId(), email, answers as Answers);
    } catch {
      // Best-effort — the email notification below is a fallback record.
    }
  }

  const resend = getResendClient();
  if (resend && NOTIFY_EMAIL) {
    resend.emails
      .send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: completionNotifySubject(),
        html: completionNotifyHtml(email, answers as Answers),
      })
      .catch(() => {
        // Best-effort only — never surfaces to the visitor.
      });
  }

  return Response.json({ ok: true });
}
