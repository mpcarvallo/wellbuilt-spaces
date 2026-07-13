/**
 * Transparent, profile-based scoring for WellBuilt Home V4.
 *
 * IMPORTANT FRAMING
 * These are indicators derived only from a person's questionnaire answers.
 * They are NOT measured building performance. There are no sensors, no
 * laboratory tests, and no on-site inspection behind any number here. A higher
 * value means the answers suggest fewer things worth attention in that
 * category; a lower value means the answers suggest a few things worth looking
 * into. See docs/SCORING.md for the full method.
 *
 * Method (per category):
 *   risk points  = sum of the `risk` weights on the options the user selected
 *   max points   = structural maximum risk for the questions the user ANSWERED
 *   value        = 100 - (risk / max) * SPREAD, floored at FLOOR
 * Unanswered questions are excluded from both sums, and coverage feeds a
 * confidence note rather than silently inflating the value.
 */

import { questionnaireV4 } from "@/data/questionnaire-v4";
import { SCALE_MAX, SCALE_MIN, type Answers, type Question } from "@/types/questionnaire";
import type { CategoryIndicator, IndicatorLevel, ReportCategory } from "@/types/home-profile";

export const RULES_VERSION = "v4-rules-1";

const SPREAD = 70; // maximum deduction from 100
const FLOOR = 30; // lowest an indicator can go
const NEUTRAL_WHEN_UNKNOWN = 78; // shown when a category has no answered risk questions

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  air: "Air and ventilation",
  water: "Water and moisture",
  light_comfort: "Light and comfort",
  materials: "Materials",
  sustainability: "Sustainability",
  maintenance: "Maintenance readiness",
};

/**
 * Which questions feed each report category. Note this deliberately differs
 * from the raw `pillar` tags: the moisture question (tagged `air` in the data)
 * belongs to "Water and moisture," and light + comfort questions combine.
 */
const CATEGORY_QUESTIONS: Record<ReportCategory, string[]> = {
  air: ["stove_type", "kitchen_exhaust", "bath_exhaust"],
  water: ["moisture", "drinking_water", "water_concerns"],
  light_comfort: ["night_light", "daylight", "bedroom_sleep", "clutter", "thermal_comfort"],
  materials: ["fragrance", "recent_projects", "flooring"],
  sustainability: ["energy_priorities"],
  maintenance: ["hvac_filter", "maintenance_confidence", "safety_checks"],
};

const BY_ID: Record<string, Question> = Object.fromEntries(
  questionnaireV4.map((q) => [q.id, q])
);

/** questionId -> optionValue -> risk weight (0 when unspecified). Built from the data. */
const OPTION_RISK: Record<string, Record<string, number>> = Object.fromEntries(
  questionnaireV4.map((q) => [
    q.id,
    Object.fromEntries((q.options ?? []).map((o) => [o.value, o.risk ?? 0])),
  ])
);

const SCALE_RANGE = SCALE_MAX - SCALE_MIN; // 4

/** Risk points contributed by a single answered question. */
function pointsFor(q: Question, answers: Answers): number {
  const v = answers[q.id];
  if (v === undefined) return 0;

  if (q.type === "scale" && typeof v === "number") {
    // Low scale value = less restorative / less confident = more risk.
    return Math.max(0, SCALE_MAX - v);
  }
  if (q.type === "single" && typeof v === "string") {
    return OPTION_RISK[q.id]?.[v] ?? 0;
  }
  if (q.type === "multi" && Array.isArray(v)) {
    return v.reduce((sum, val) => sum + (OPTION_RISK[q.id]?.[val] ?? 0), 0);
  }
  return 0;
}

/** Structural maximum risk points a question can contribute. */
function maxPointsFor(q: Question): number {
  if (q.type === "scale") return SCALE_RANGE;
  const risks = Object.values(OPTION_RISK[q.id] ?? {});
  if (risks.length === 0) return 0;
  if (q.type === "single") return Math.max(0, ...risks);
  // multi: worst case is selecting every risk-bearing option.
  return risks.reduce((a, b) => a + b, 0);
}

function isAnsweredValue(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return typeof v === "number";
}

function levelFor(value: number): IndicatorLevel {
  if (value >= 75) return "strong";
  if (value >= 50) return "developing";
  return "attention";
}

function noteFor(
  level: IndicatorLevel,
  coverage: number,
  label: string
): string {
  if (coverage === 0) {
    return `Based on your answers, we don't have enough detail yet to reflect ${label.toLowerCase()}.`;
  }
  const lowConfidence = coverage < 0.5 ? " A few unanswered questions would sharpen this." : "";
  if (level === "attention") {
    return `Based on your answers, this is a good area to focus on first.${lowConfidence}`;
  }
  if (level === "developing") {
    return `Based on your answers, there may be a few worthwhile improvements here.${lowConfidence}`;
  }
  return `Based on your answers, this area looks well handled.${lowConfidence}`;
}

/** Raw 0–100 value for one category (for internal prioritization). */
export function categoryValue(category: ReportCategory, answers: Answers): number {
  const ids = CATEGORY_QUESTIONS[category];
  let points = 0;
  let max = 0;
  for (const id of ids) {
    const q = BY_ID[id];
    if (!q || !isAnsweredValue(answers[id])) continue;
    points += pointsFor(q, answers);
    max += maxPointsFor(q);
  }
  if (max === 0) return NEUTRAL_WHEN_UNKNOWN;
  const deduction = (points / max) * SPREAD;
  return Math.max(FLOOR, Math.round(100 - deduction));
}

function coverageFor(category: ReportCategory, answers: Answers): number {
  const ids = CATEGORY_QUESTIONS[category];
  const answered = ids.filter((id) => isAnsweredValue(answers[id])).length;
  return ids.length === 0 ? 0 : answered / ids.length;
}

export const REPORT_CATEGORIES = Object.keys(CATEGORY_LABELS) as ReportCategory[];

/** Full set of profile-based indicators, one per report category. */
export function computeIndicators(answers: Answers): CategoryIndicator[] {
  return REPORT_CATEGORIES.map((category) => {
    const value = categoryValue(category, answers);
    const coverage = coverageFor(category, answers);
    const label = CATEGORY_LABELS[category];
    const level = coverage === 0 ? "developing" : levelFor(value);
    return { category, label, value, level, note: noteFor(level, coverage, label) };
  });
}

/** Categories most worth attention (lowest values), used to prioritize actions. */
export function rankedByAttention(answers: Answers): CategoryIndicator[] {
  return [...computeIndicators(answers)].sort((a, b) => a.value - b.value);
}
