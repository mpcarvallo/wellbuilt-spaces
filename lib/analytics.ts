/**
 * Provider-neutral analytics for WellBuilt Home V4.
 *
 * Events are dispatched to whatever analytics provider is present on the page
 * (Plausible, GA/gtag, or a dataLayer), and fall back to a debug log in
 * development. No provider SDK is hard-wired, so swapping tools is a one-file
 * change.
 *
 * PRIVACY: this helper never forwards free-text answers or PII. Callers pass
 * only structural properties (question ids, counts, enums). As a safety net,
 * `sanitize` drops known sensitive keys and truncates long strings.
 */

export type AnalyticsEvent =
  | "questionnaire_started"
  | "section_completed"
  | "question_answered"
  | "questionnaire_abandoned"
  | "questionnaire_completed"
  | "snapshot_generated"
  | "snapshot_rated"
  | "recommendation_expanded"
  | "email_submitted"
  | "upgrade_waitlist_clicked";

type Primitive = string | number | boolean;
export type EventProps = Record<string, Primitive>;

/** Keys that must never be sent to analytics, even if a caller passes them. */
const SENSITIVE_KEYS = new Set(["email", "open_note", "zip_code", "note", "answer", "value", "text"]);

function sanitize(props?: EventProps): EventProps {
  if (!props) return {};
  const out: EventProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (SENSITIVE_KEYS.has(key)) continue;
    if (typeof value === "string") {
      // Structural strings only (ids/enums). Truncate defensively.
      out[key] = value.slice(0, 64);
    } else {
      out[key] = value;
    }
  }
  return out;
}

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;
type Plausible = (name: string, options?: { props?: Record<string, unknown> }) => void;

export function track(event: AnalyticsEvent, props?: EventProps): void {
  if (typeof window === "undefined") return;
  const payload = sanitize(props);

  const w = window as unknown as {
    plausible?: Plausible;
    gtag?: Gtag;
    dataLayer?: unknown[];
  };

  try {
    if (typeof w.plausible === "function") {
      w.plausible(event, { props: payload });
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", event, payload);
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...payload });
    }
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, payload);
    }
  } catch {
    // Analytics must never break the app.
  }
}
