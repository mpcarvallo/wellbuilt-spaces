import { getResendClient, FROM_EMAIL, NOTIFY_EMAIL } from "@/lib/resend";
import { isValidEmail } from "@/lib/validate-email";
import {
  waitlistNotifySubject,
  waitlistNotifyHtml,
  waitlistConfirmSubject,
  waitlistConfirmHtml,
} from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let email: unknown;
  try {
    const body = (await req.json()) as { email?: unknown };
    email = body.email;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const resend = getResendClient();
  if (!resend || !NOTIFY_EMAIL) {
    return Response.json(
      { error: "Waitlist signups aren't configured yet." },
      { status: 503 }
    );
  }

  // The notify email is the actual record of this signup — it must succeed.
  // The confirmation to the visitor is a best-effort nicety on top of that.
  const notify = await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    subject: waitlistNotifySubject(),
    html: waitlistNotifyHtml(email),
  });
  if (notify.error) {
    return Response.json({ error: "Could not join the waitlist. Please try again." }, { status: 502 });
  }

  resend.emails
    .send({
      from: FROM_EMAIL,
      to: email,
      subject: waitlistConfirmSubject(),
      html: waitlistConfirmHtml(),
    })
    .catch(() => {
      // Best-effort — the signup itself is already recorded via the notify email above.
    });

  return Response.json({ ok: true });
}
