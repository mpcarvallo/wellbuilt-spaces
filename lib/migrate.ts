/**
 * Backward-compatibility migration for WellBuilt Home V4.
 *
 * The previous shipped questionnaire (V3, "wellbuilt-validation-v3") was a
 * validation survey about attitudes and priorities. V4 is a home-profile
 * questionnaire about the home itself, so only a subset of fields maps
 * reliably. This module maps what it can and LEAVES EVERYTHING ELSE BLANK —
 * it never invents an answer. New submissions always carry schemaVersion: 4.
 *
 * Mapped:  currentSituation→ownership, homeType→home_type,
 *          homeAge→year_built (unambiguous bands only),
 *          householdMembers→household, decisionInfluencingNeeds→health_sensitivities,
 *          currentPriorities→primary_goals (max 3).
 * Not mapped (no reliable V4 equivalent): the V3 decision/attitude/pricing
 *          questions (delayedDecision, adviceSources, priceRange, ratings,
 *          open-text prompts, etc.). These are intentionally dropped.
 */

import type { Answers } from "@/types/questionnaire";

/** localStorage keys written by previous questionnaire versions. */
const LEGACY_KEYS = ["wellbuilt-validation-v3"];

const OWNERSHIP_MAP: Record<string, string> = {
  "I own my home": "own",
  "I own an investment property": "own",
  "I rent my home": "rent",
};

const HOME_TYPE_MAP: Record<string, string> = {
  Apartment: "apartment",
  Condo: "condo",
  Townhouse: "townhome",
  "Single-family home": "house",
  "Two- to four-unit building": "multifamily",
};

/** Only unambiguous age→build-year bands are mapped; the rest stay blank. */
const YEAR_BUILT_MAP: Record<string, string> = {
  "Less than 5 years": "2020_plus",
  "More than 100 years": "pre1940",
  "Not sure": "unknown",
};

const HOUSEHOLD_MAP: Record<string, string> = {
  "Just me": "one_adult",
  "Partner or spouse": "adults",
  "Adult family members": "adults",
  "Baby or toddler": "young_children",
  "School-age child": "children",
  Teenager: "children",
  "Older adult": "older_adults",
  Pet: "pets",
};

const SENSITIVITY_MAP: Record<string, string> = {
  "Allergy-related concerns": "allergies",
  "Mobility or accessibility needs": "mobility",
  "Sensory preferences": "sensory",
  "Sensitivity to odors": "chemical",
};

const GOAL_MAP: Record<string, string> = {
  "Better sleep": "sleep",
  "Cleaner-feeling indoor air": "air",
  "Fewer odors, dust, or allergens": "allergies",
  "Less clutter": "stress",
  "More calming or less overstimulating spaces": "stress",
  "Better focus or work-from-home spaces": "focus",
  "More confidence in material choices": "materials",
  "Lower energy use": "sustainability",
  "Preparing the home for aging": "family_support",
  "Spaces that better support children": "family_support",
};

function mapSingle(map: Record<string, string>, value: unknown): string | undefined {
  return typeof value === "string" ? map[value] : undefined;
}

function mapMulti(map: Record<string, string>, value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const mapped = value
    .map((v) => (typeof v === "string" ? map[v] : undefined))
    .filter((v): v is string => Boolean(v));
  return Array.from(new Set(mapped)); // de-duplicate collisions (e.g. two → adults)
}

/** Pure mapping from V3 raw answers to V4 answers. Unmappable fields are omitted. */
export function migrateV3ToV4(v3: Answers): Answers {
  const out: Answers = {};

  const ownership = mapSingle(OWNERSHIP_MAP, v3.currentSituation);
  if (ownership) out.ownership = ownership;

  const homeType = mapSingle(HOME_TYPE_MAP, v3.homeType);
  if (homeType) out.home_type = homeType;

  const yearBuilt = mapSingle(YEAR_BUILT_MAP, v3.homeAge);
  if (yearBuilt) out.year_built = yearBuilt;

  const household = mapMulti(HOUSEHOLD_MAP, v3.householdMembers);
  if (household.length) out.household = household;

  const sensitivities = mapMulti(SENSITIVITY_MAP, v3.decisionInfluencingNeeds);
  if (sensitivities.length) out.health_sensitivities = sensitivities;

  const goals = mapMulti(GOAL_MAP, v3.currentPriorities).slice(0, 3); // V4 max 3
  if (goals.length) out.primary_goals = goals;

  return out;
}

export type LegacyLoad = { answers: Answers; source: string };

/**
 * Reads any previous-version saved questionnaire from localStorage and returns
 * mapped V4 answers, or null if none exists. Safe to call on the client only.
 */
export function loadLegacyAnswers(): LegacyLoad | null {
  if (typeof window === "undefined") return null;
  for (const key of LEGACY_KEYS) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { answers?: Answers };
      if (!parsed?.answers) continue;
      const answers = migrateV3ToV4(parsed.answers);
      if (Object.keys(answers).length === 0) continue;
      return { answers, source: key };
    } catch {
      // Ignore corrupt legacy data.
    }
  }
  return null;
}
