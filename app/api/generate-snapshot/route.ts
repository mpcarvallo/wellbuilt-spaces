import type { Answers, Pillar } from "@/types/questionnaire";
import type { Confidence, CostBand, Effort, Snapshot, SnapshotAction } from "@/types/home-profile";
import { SCHEMA_VERSION } from "@/types/home-profile";
import { deriveGroups } from "@/lib/profile";
import { computeIndicators, RULES_VERSION } from "@/lib/scoring";
import { generateSnapshot, DISCLAIMER } from "@/lib/snapshot";
import { MODEL, SYSTEM_PROMPT, buildUserPrompt } from "@/lib/system-prompt";

export const runtime = "nodejs";

const EFFORTS = new Set<Effort>(["quick", "afternoon", "weekend", "professional"]);
const COSTS = new Set<CostBand>(["free", "under_100", "100_500", "500_2000", "over_2000"]);
const CONFIDENCES = new Set<Confidence>(["high", "medium", "low"]);
const PILLARS = new Set<Pillar>([
  "lifestyle",
  "air",
  "water",
  "light",
  "comfort",
  "materials",
  "sustainability",
  "maintenance",
]);

type RawAction = Record<string, unknown>;

/** Strictly validates one AI-produced action; returns null if it doesn't conform. */
function validateAction(raw: unknown): SnapshotAction | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as RawAction;
  if (typeof a.id !== "string" || typeof a.title !== "string" || typeof a.why !== "string") {
    return null;
  }
  if (!EFFORTS.has(a.effort as Effort)) return null;
  if (!COSTS.has(a.costBand as CostBand)) return null;
  if (!CONFIDENCES.has(a.confidence as Confidence)) return null;
  const categories = Array.isArray(a.categories)
    ? (a.categories.filter((c) => PILLARS.has(c as Pillar)) as Pillar[])
    : [];
  if (categories.length === 0) return null;
  const steps = Array.isArray(a.steps)
    ? a.steps.filter((s): s is string => typeof s === "string")
    : [];
  return {
    id: a.id,
    title: a.title,
    why: a.why,
    effort: a.effort as Effort,
    costBand: a.costBand as CostBand,
    diyFriendly: Boolean(a.diyFriendly),
    categories,
    confidence: a.confidence as Confidence,
    professionalNote: typeof a.professionalNote === "string" ? a.professionalNote : undefined,
    steps: steps.length ? steps : undefined,
  };
}

/** Parses + validates the model's JSON. Returns a full Snapshot or null to trigger fallback. */
function buildAiSnapshot(text: string, answers: Answers, modelVersion: string): Snapshot | null {
  let parsed: unknown;
  try {
    // Tolerate accidental code fences.
    const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Record<string, unknown>;
  if (typeof p.intro !== "string" || !Array.isArray(p.topActions) || p.topActions.length !== 3) {
    return null;
  }
  const actions = p.topActions.map(validateAction);
  if (actions.some((a) => a === null)) return null;

  const later = Array.isArray(p.later)
    ? p.later
        .filter((l): l is { title: string; why?: string } => Boolean(l) && typeof (l as { title?: unknown }).title === "string")
        .slice(0, 4)
    : [];
  const missingInfo = Array.isArray(p.missingInfo)
    ? p.missingInfo.filter((m): m is string => typeof m === "string").slice(0, 3)
    : [];

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedBy: "ai",
    rulesVersion: RULES_VERSION,
    modelVersion,
    intro: p.intro,
    topActions: actions as SnapshotAction[],
    later,
    missingInfo,
    indicators: computeIndicators(answers), // deterministic — never model-generated
    disclaimer: DISCLAIMER,
  };
}

export async function POST(req: Request): Promise<Response> {
  let answers: Answers;
  try {
    const body = (await req.json()) as { answers?: unknown };
    if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) {
      return Response.json({ error: "Invalid answers" }, { status: 400 });
    }
    answers = body.answers as Answers;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Deterministic result is always available (this is also the fallback).
  const fallback = generateSnapshot(answers);

  // Only attempt AI when a key is configured.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ snapshot: fallback });
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic();
    const message = await client.messages.create(
      {
        model: MODEL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(deriveGroups(answers)) }],
      },
      { timeout: 18000 }
    );
    const text = message.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const aiSnapshot = buildAiSnapshot(text, answers, message.model);
    return Response.json({ snapshot: aiSnapshot ?? fallback });
  } catch {
    // Any AI/network/parse failure → deterministic fallback keeps results working.
    return Response.json({ snapshot: fallback });
  }
}
