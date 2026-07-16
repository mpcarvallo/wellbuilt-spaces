import type { Answers } from "@/types/questionnaire";
import type { Snapshot, SnapshotAction } from "@/types/home-profile";
import { COST_LABELS, EFFORT_LABELS, CONFIDENCE_LABELS, PILLAR_LABELS } from "@/lib/labels";
import { labelForValue, labelsForValues } from "@/lib/answer-labels";

const MOSS = "#536b4f";
const CREAM = "#f7f4ee";
const CARD = "#fffdf8";
const BORDER = "#e5ded2";
const FOREGROUND = "#222222";
const MUTED = "#6b6b63";

/** Snapshot content may be AI-generated — escape before interpolating into HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function actionHtml(action: SnapshotAction, rank: number): string {
  const tags = [
    EFFORT_LABELS[action.effort],
    COST_LABELS[action.costBand],
    action.diyFriendly ? "DIY-friendly" : "Professional recommended",
    CONFIDENCE_LABELS[action.confidence],
    ...action.categories.map((c) => PILLAR_LABELS[c]),
  ]
    .map(escapeHtml)
    .join(" &nbsp;&middot;&nbsp; ");

  return `
    <tr>
      <td style="padding:20px 0;border-top:1px solid ${BORDER};">
        <p style="margin:0 0 6px;font-size:13px;color:${MUTED};">Priority ${rank}</p>
        <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:${FOREGROUND};">${escapeHtml(action.title)}</p>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:${FOREGROUND};">${escapeHtml(action.why)}</p>
        <p style="margin:0;font-size:12px;color:${MUTED};">${tags}</p>
      </td>
    </tr>`;
}

function actionText(action: SnapshotAction, rank: number): string {
  const tags = [
    EFFORT_LABELS[action.effort],
    COST_LABELS[action.costBand],
    action.diyFriendly ? "DIY-friendly" : "Professional recommended",
    CONFIDENCE_LABELS[action.confidence],
    ...action.categories.map((c) => PILLAR_LABELS[c]),
  ].join(" · ");
  return `${rank}. ${action.title}\n${action.why}\n${tags}\n`;
}

export function snapshotEmailSubject(): string {
  return "Your WellBuilt Spaces Home Snapshot";
}

export function snapshotEmailHtml(snapshot: Snapshot): string {
  const actionsHtml = snapshot.topActions.map(actionHtml).join("");
  return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MOSS};font-family:Arial,sans-serif;">WellBuilt Spaces</p>
          <h1 style="margin:0;font-size:22px;line-height:1.35;color:${FOREGROUND};">${escapeHtml(snapshot.intro)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 4px;">
          <p style="margin:0;font-size:13px;color:${MUTED};font-family:Arial,sans-serif;">Your top three priorities:</p>
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${actionsHtml}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 28px;border-top:1px solid ${BORDER};">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};font-family:Arial,sans-serif;">${escapeHtml(snapshot.disclaimer)}</p>
        </td>
      </tr>
    </table>
  </div>`;
}

export function snapshotEmailText(snapshot: Snapshot): string {
  const actions = snapshot.topActions.map(actionText).join("\n");
  return `WellBuilt Spaces — Your Home Snapshot\n\n${snapshot.intro}\n\n${actions}\n${snapshot.disclaimer}\n`;
}

export function waitlistNotifySubject(): string {
  return "New WellBuilt Spaces waitlist signup";
}

export function waitlistNotifyHtml(email: string): string {
  return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:16px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MOSS};">WellBuilt Spaces</p>
          <h1 style="margin:0 0 12px;font-size:18px;color:${FOREGROUND};">New waitlist signup</h1>
          <p style="margin:0;font-size:15px;color:${FOREGROUND};">${escapeHtml(email)}</p>
        </td>
      </tr>
    </table>
  </div>`;
}

export function waitlistConfirmSubject(): string {
  return "You're on the WellBuilt Spaces waitlist";
}

export function waitlistConfirmHtml(): string {
  return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:16px;">
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MOSS};font-family:Arial,sans-serif;">WellBuilt Spaces</p>
          <h1 style="margin:0 0 10px;font-size:20px;color:${FOREGROUND};">You're on the list</h1>
          <p style="margin:0;font-size:14px;line-height:1.6;color:${FOREGROUND};">
            Thanks for your interest in the full Home Roadmap. We'll let you know as soon as it's ready.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

export function snapshotRequestNotifySubject(): string {
  return "Someone requested their WellBuilt Snapshot by email";
}

export function snapshotRequestNotifyHtml(email: string): string {
  return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:16px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MOSS};">WellBuilt Spaces</p>
          <h1 style="margin:0 0 12px;font-size:18px;color:${FOREGROUND};">Snapshot emailed to a visitor</h1>
          <p style="margin:0;font-size:15px;color:${FOREGROUND};">${escapeHtml(email)}</p>
        </td>
      </tr>
    </table>
  </div>`;
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined;
const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

function summaryRow(label: string, value: string | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 0;font-size:13px;color:${MUTED};width:140px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;font-size:13px;color:${FOREGROUND};">${escapeHtml(value)}</td></tr>`;
}

export function completionNotifySubject(): string {
  return "Someone completed a WellBuilt Snapshot";
}

/** Best-effort visibility into questionnaire completions. Never includes open-text verbatim beyond the visitor's own note field, which the questionnaire tells respondents not to fill with sensitive details. */
export function completionNotifyHtml(answers: Answers): string {
  const goals = labelsForValues("primary_goals", arr(answers.primary_goals)).join(", ");
  const homeType = str(answers.home_type) && labelForValue("home_type", String(answers.home_type));
  const ownership = str(answers.ownership) && labelForValue("ownership", String(answers.ownership));
  const budget = str(answers.budget) && labelForValue("budget", String(answers.budget));
  const firstRoom = str(answers.first_room) && labelForValue("first_room", String(answers.first_room));
  const note = str(answers.open_note);

  const rows = [
    summaryRow("Goals", goals || undefined),
    summaryRow("Home", [homeType, ownership].filter(Boolean).join(" · ") || undefined),
    summaryRow("Budget", budget),
    summaryRow("Wants to start with", firstRoom),
  ].join("");

  return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:16px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MOSS};">WellBuilt Spaces</p>
          <h1 style="margin:0 0 12px;font-size:18px;color:${FOREGROUND};">A questionnaire was just completed</h1>
          <table role="presentation" style="border-collapse:collapse;">${rows}</table>
          ${
            note
              ? `<p style="margin:16px 0 0;padding-top:12px;border-top:1px solid ${BORDER};font-size:13px;line-height:1.6;color:${FOREGROUND};"><em>${escapeHtml(note)}</em></p>`
              : ""
          }
        </td>
      </tr>
    </table>
  </div>`;
}
