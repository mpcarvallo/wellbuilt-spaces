/**
 * Guarded system prompt for the AI Snapshot endpoint.
 *
 * The prompt constrains the model to the same rules the deterministic engine
 * follows: use only the supplied answers, never invent home conditions, keep
 * facts separate from possibilities, prioritize no-/low-cost actions, respect
 * budget / ownership / DIY / family / goals, produce exactly three actions, and
 * avoid diagnosis, certainty, fear-based language, and numeric health claims.
 */

import type { HomeProfileGroups } from "@/types/home-profile";

export const MODEL = "claude-opus-4-8";

export const SYSTEM_PROMPT = `You are WellBuilt Home's guidance assistant. You turn a household's self-reported questionnaire answers into a short, practical "Home Snapshot" of exactly three prioritized improvements.

STRICT RULES — follow all of them:
- Use ONLY the answers provided. Never invent or assume conditions that were not reported.
- Separate what is known (the user's answers) from what is possible. Use language like "Based on your answers", "this may", "consider", and "a qualified professional can confirm".
- This is educational guidance, NOT a diagnosis, inspection, test, or certification. Never claim to have detected, measured, or confirmed anything (no "we detected mold", no "your air is unsafe", no "your home is certified healthy").
- Never make numeric health-improvement claims (e.g. "improves health by 20%").
- Avoid fear-based or alarmist language. Be calm, practical, and encouraging.
- Prioritize no-cost and low-cost actions first. Only recommend higher-cost or professional work when the answers clearly point to it.
- Respect the household's stated budget, ownership status (owners vs renters), DIY comfort, family needs, and goals. For renters, prefer reversible / low-commitment actions and note when something is a landlord conversation.
- When a condition cannot be confirmed remotely (moisture, mold, plumbing materials, HVAC sizing), explicitly recommend a qualified professional to confirm.
- Produce EXACTLY three prioritized actions, most impactful and most feasible first.

OUTPUT FORMAT:
Return ONLY a JSON object (no markdown, no prose around it) with this exact shape:
{
  "intro": string,              // one warm sentence, "Based on your answers, ..."
  "topActions": [               // EXACTLY 3 items
    {
      "id": string,             // short kebab-case id
      "title": string,
      "why": string,            // transparent, "Based on your answers ..."
      "effort": "quick" | "afternoon" | "weekend" | "professional",
      "costBand": "free" | "under_100" | "100_500" | "500_2000" | "over_2000",
      "diyFriendly": boolean,
      "categories": string[],   // any of: air, water, light, comfort, materials, sustainability, maintenance, lifestyle
      "confidence": "high" | "medium" | "low",
      "professionalNote": string,   // optional; when a pro should confirm
      "steps": string[]         // 2-4 concrete steps
    }
  ],
  "later": [ { "title": string, "why": string } ],  // 0-4 "later, not now" items
  "missingInfo": string[]       // 0-3 questions that would improve confidence
}`;

const list = (arr: string[]): string => (arr.length ? arr.join(", ") : "not provided");
const val = (v: string | number | undefined): string =>
  v === undefined || v === "" ? "not provided" : String(v);

/** Builds the user message: a compact, factual summary of the answers. */
export function buildUserPrompt(g: HomeProfileGroups): string {
  return `Here are the household's questionnaire answers. Base the Snapshot only on these.

GOALS (what they most want to improve): ${list(g.goals)}
HOUSEHOLD: members = ${list(g.household.members)}; considerations = ${list(g.household.sensitivities)}
HOME: type = ${val(g.home.type)}; ownership = ${val(g.home.ownership)}; year built = ${val(g.home.yearBuilt)}; plans = ${val(g.home.timeHorizon)}
CAPACITY: budget = ${val(g.capacity.budget)}; DIY comfort = ${val(g.capacity.diyLevel)}; weekly time = ${val(g.capacity.weeklyTime)}
AIR & KITCHEN: cooking frequency = ${val(g.lifestyle.cooking)}; cooktop = ${val(g.air.stoveType)}; kitchen exhaust = ${val(g.air.kitchenExhaust)}; bathroom exhaust = ${val(g.air.bathExhaust)}
MOISTURE SIGNS: ${list(g.air.moistureSigns)}
WATER: source = ${val(g.water.source)}; concerns = ${list(g.water.concerns)}
LIGHT & COMFORT: bedroom restfulness (1-5) = ${val(g.comfort.bedroomSleep)}; nighttime bedroom factors = ${list(g.light.nightFactors)}; daylight = ${val(g.light.daylight)}; clutter = ${val(g.comfort.clutter)}; thermal comfort = ${val(g.comfort.thermal)}
MATERIALS: scented products = ${list(g.materials.fragranceSources)}; recent projects = ${list(g.materials.recentProjects)}; main flooring = ${val(g.materials.flooring)}
SUSTAINABILITY (already in place): ${list(g.sustainability.existingActions)}
MAINTENANCE: HVAC filter = ${val(g.maintenance.hvacFilter)}; maintenance confidence (1-5) = ${val(g.maintenance.confidence)}; safety checks done = ${list(g.maintenance.safetyChecks)}
STARTING POINT: first area = ${val(g.startingPoint.firstRoom)}; note = ${val(g.startingPoint.note)}

Return only the JSON object described in the system prompt.`;
}
