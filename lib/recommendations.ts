/**
 * Deterministic, rule-based recommendation engine for WellBuilt Home V4.
 *
 * Every recommendation is triggered only by the user's own answers, phrased in
 * transparent "based on your answers / may / consider / a professional can
 * confirm" language, and never asserts a hidden condition (no "we detected…",
 * no "your air is unsafe"). This engine is also the deterministic fallback used
 * when the AI endpoint is unavailable, so the results page always works.
 *
 * Some rules from the previous question set were retired because their
 * triggering question no longer exists (bathroom exhaust, water source/
 * concerns, flooring type, smoke/CO alarms, seasonal maintenance confidence,
 * sustainability actions in place) — see docs/QUESTIONNAIRE.md for the
 * current question list and what was cut.
 */

import type { Answers, Pillar } from "@/types/questionnaire";
import type { CostBand, Effort, SnapshotAction } from "@/types/home-profile";

const has = (v: unknown, val: string): boolean => Array.isArray(v) && v.includes(val);
const eq = (v: unknown, val: string): boolean => v === val;
const scaleAtMost = (v: unknown, n: number): boolean => typeof v === "number" && v <= n;

/** Cost bands in ascending order, for budget-feasibility comparisons. */
const COST_ORDER: CostBand[] = ["free", "under_100", "100_500", "500_2000", "over_2000"];
const costRank = (c: CostBand): number => COST_ORDER.indexOf(c);
const budgetRank = (budget: string | undefined): number => {
  const idx = COST_ORDER.indexOf((budget ?? "500_2000") as CostBand);
  return idx === -1 ? COST_ORDER.indexOf("500_2000") : idx;
};

type Rule = {
  id: string;
  title: string;
  why: string;
  categories: Pillar[];
  costBand: CostBand;
  effort: Effort;
  diyFriendly: boolean;
  /** 1 (minor) – 4 (safety-critical). */
  impact: number;
  confidence: SnapshotAction["confidence"];
  /** Marks life-safety actions that must not fall out of the top three when triggered. */
  safety?: boolean;
  professionalNote?: string;
  steps: string[];
  /** Goal values this action serves (adds relevance when the user chose them). */
  goals?: string[];
  trigger: (a: Answers) => boolean;
};

const RULES: Rule[] = [
  {
    id: "kitchen-vent",
    title: "Ventilate every time you cook",
    why: "Based on your answers, cooking can add moisture and combustion byproducts to indoor air—especially on a gas cooktop or when exhaust doesn't vent outside.",
    categories: ["air", "lifestyle"],
    costBand: "free",
    effort: "quick",
    diyFriendly: true,
    impact: 3,
    confidence: "high",
    steps: [
      "Turn the range hood on before you start cooking and leave it running for a few minutes after.",
      "If your hood recirculates or you have none, crack a nearby window while cooking when weather allows.",
      "Favor back burners, which capture exhaust more effectively.",
    ],
    professionalNote: "A qualified HVAC contractor can confirm whether your hood vents outside and size an upgrade.",
    goals: ["air", "allergies"],
    trigger: (a) =>
      eq(a.cooktop_type, "gas") ||
      eq(a.kitchen_exhaust, "recirculating") ||
      eq(a.kitchen_exhaust, "none") ||
      ((eq(a.cook_frequency, "daily") || eq(a.cook_frequency, "frequent")) && !eq(a.kitchen_exhaust, "outside")),
  },
  {
    id: "reduce-fragrance",
    title: "Reduce indoor fragrance sources for two weeks",
    why: "Based on your answers, scented plug-ins, aerosols, candles, or strongly scented cleaners are used indoors. Pausing them is a free way to see whether odors or irritation change.",
    categories: ["materials", "air"],
    costBand: "free",
    effort: "quick",
    diyFriendly: true,
    impact: 2,
    confidence: "high",
    steps: [
      "Pause scented plug-ins, aerosols, and incense for two weeks.",
      "Switch to fragrance-free or lightly scented cleaning products.",
      "Note any change in headaches, congestion, or lingering odors.",
    ],
    goals: ["air", "allergies", "materials"],
    trigger: (a) =>
      has(a.scented_products, "air_freshener") ||
      has(a.scented_products, "candles") ||
      has(a.scented_products, "cleaners"),
  },
  {
    id: "moisture-investigate",
    title: "Look into moisture signs before cosmetic fixes",
    why: "Based on your answers, you've noticed signs that can point to a moisture source. Finding and correcting the source first is usually more effective than covering it up.",
    categories: ["water"],
    costBand: "500_2000",
    effort: "professional",
    diyFriendly: false,
    impact: 3.5,
    confidence: "low",
    steps: [
      "Note where and when you see moisture, musty odors, or staining.",
      "Address the likely source (drainage, plumbing, ventilation) before repainting or sealing.",
      "For anything widespread, or if someone in the home is sensitive, get a professional assessment.",
    ],
    professionalNote: "Moisture and mold are hard to confirm remotely—a qualified inspector or remediation professional can identify the source and extent.",
    goals: ["allergies", "air"],
    trigger: (a) =>
      has(a.moisture_signs, "leaks") || has(a.moisture_signs, "staining") || has(a.moisture_signs, "musty"),
  },
  {
    id: "hvac-filter",
    title: "Set a recurring HVAC filter reminder",
    why: "Based on your answers, the HVAC filter may be overdue or its status is unknown. A fresh, correctly sized filter helps the system move and clean air.",
    categories: ["air", "maintenance"],
    costBand: "under_100",
    effort: "quick",
    diyFriendly: true,
    impact: 2,
    confidence: "high",
    steps: [
      "Check the manufacturer's recommended interval (often every 1–3 months).",
      "Set a recurring phone reminder and keep a spare filter on hand.",
      "Choose a filter rated for your system that doesn't overly restrict airflow.",
    ],
    goals: ["air", "maintenance"],
    trigger: (a) => eq(a.hvac_filter, "old") || eq(a.hvac_filter, "mid") || eq(a.hvac_filter, "unknown"),
  },
  {
    id: "air-filtration",
    title: "Add portable air filtration in the main bedroom",
    why: "Based on your answers, someone may benefit from cleaner air where they sleep. A correctly sized portable air cleaner can reduce airborne particles.",
    categories: ["air"],
    costBand: "100_500",
    effort: "quick",
    diyFriendly: true,
    impact: 2.5,
    confidence: "medium",
    steps: [
      "Choose a portable air cleaner sized for the bedroom's square footage.",
      "Run it on a moderate setting, especially during allergy or wildfire-smoke season.",
      "Avoid devices that intentionally produce ozone.",
    ],
    goals: ["air", "allergies", "sleep"],
    trigger: (a) =>
      has(a.household_considerations, "allergies") ||
      has(a.household_considerations, "breathing") ||
      has(a.moisture_signs, "staining") ||
      has(a.household_composition, "pets"),
  },
  {
    id: "sleep-environment",
    title: "Improve the sleep environment",
    why: "Based on your answers, your main bedroom could feel more restorative. Addressing the biggest disruptor—light, noise, or temperature—often helps most.",
    categories: ["light", "comfort"],
    costBand: "100_500",
    effort: "afternoon",
    diyFriendly: true,
    impact: 2.5,
    confidence: "medium",
    steps: [
      "Identify the biggest disruptor: outdoor light, device lights, noise, or temperature.",
      "Try reversible fixes first—blackout curtains, covering indicator lights, a fan or white noise.",
      "Keep work materials and clutter out of the sleeping area.",
    ],
    goals: ["sleep", "focus", "stress"],
    trigger: (a) =>
      scaleAtMost(a.bedroom_restfulness, 3) ||
      has(a.bedroom_disruptors, "outdoor_light") ||
      has(a.bedroom_disruptors, "device_light") ||
      has(a.bedroom_disruptors, "noise") ||
      has(a.bedroom_disruptors, "temperature"),
  },
  {
    id: "daylight",
    title: "Bring more usable daylight into key rooms",
    why: "Based on your answers, daylight in the rooms you use most could be better balanced, which can affect mood and comfort.",
    categories: ["light"],
    costBand: "100_500",
    effort: "afternoon",
    diyFriendly: true,
    impact: 1.5,
    confidence: "medium",
    steps: [
      "For too little light, use lighter window treatments and mirrors, and keep glass unobstructed.",
      "For glare or heat, add adjustable shades or light-filtering film.",
      "Match electric lighting to the time of day where daylight is limited.",
    ],
    goals: ["focus", "sleep"],
    trigger: (a) => eq(a.daylight, "low") || eq(a.daylight, "varies"),
  },
  {
    id: "declutter",
    title: "Reset clutter in one high-use area",
    why: "Based on your answers, clutter interferes with daily routines. A single reset in a high-traffic space can lower daily friction and stress.",
    categories: ["comfort"],
    costBand: "free",
    effort: "afternoon",
    diyFriendly: true,
    impact: 1.5,
    confidence: "high",
    steps: [
      "Pick one high-use surface or room and clear it completely.",
      "Give frequently used items a defined home nearby.",
      "Add a small daily reset habit to keep it that way.",
    ],
    goals: ["stress", "focus"],
    trigger: (a) =>
      eq(a.clutter_frequency, "often") || eq(a.clutter_frequency, "daily") || has(a.bedroom_disruptors, "clutter"),
  },
  {
    id: "thermal-comfort",
    title: "Address rooms that are too hot, cold, or drafty",
    why: "Based on your answers, some rooms are regularly uncomfortable. Small air-sealing and comfort steps can help before larger system changes.",
    categories: ["comfort"],
    costBand: "100_500",
    effort: "afternoon",
    diyFriendly: true,
    impact: 2,
    confidence: "medium",
    steps: [
      "Check for drafts at windows and doors and add weatherstripping where needed.",
      "Use door draft stoppers and adjust vents to balance airflow between rooms.",
      "For whole-home discomfort, plan a professional assessment of insulation and HVAC.",
    ],
    professionalNote: "An HVAC or weatherization professional can diagnose whole-home comfort issues an assessment can't.",
    trigger: (a) =>
      eq(a.room_temperature, "some_rooms") ||
      eq(a.room_temperature, "whole_home") ||
      eq(a.room_temperature, "sometimes"),
  },
  {
    id: "manage-noise",
    title: "Take a few steps to manage everyday noise",
    why: "Based on your answers, noise is a regular presence in your home. A few targeted changes can meaningfully reduce how disruptive it feels.",
    categories: ["comfort"],
    costBand: "under_100",
    effort: "quick",
    diyFriendly: true,
    impact: 2,
    confidence: "medium",
    steps: [
      "Note whether noise mostly comes from outside, inside, or both.",
      "Add soft materials—rugs, curtains, upholstered furniture—to absorb sound in hard-surfaced rooms.",
      "Weatherstrip doors and windows, which also helps block outside noise.",
      "For persistent inside noise (HVAC, plumbing, appliances), keep a note of when it happens for a professional to reference.",
    ],
    goals: ["sleep", "focus", "stress"],
    trigger: (a) =>
      eq(a.acoustics, "frequent") ||
      eq(a.acoustics, "outside_occasional") ||
      eq(a.acoustics, "inside_occasional"),
  },
  {
    id: "air-out-materials",
    title: "Air out recent purchases and projects",
    why: "Based on your answers, new materials were added in the last year. New paint, flooring, cabinets, or furniture can off-gas for a while, and ventilation helps.",
    categories: ["materials", "air"],
    costBand: "free",
    effort: "quick",
    diyFriendly: true,
    impact: 1.5,
    confidence: "medium",
    steps: [
      "Ventilate rooms with recent projects—open windows and run fans when you can.",
      "Let new furniture or mattresses air out, ideally before heavy use.",
      "For future projects, look for lower-emission (low-VOC) materials.",
    ],
    goals: ["materials", "air", "renovation"],
    trigger: (a) =>
      has(a.recent_changes, "paint") ||
      has(a.recent_changes, "flooring") ||
      has(a.recent_changes, "cabinets") ||
      has(a.recent_changes, "furniture") ||
      has(a.recent_changes, "renovation"),
  },
];

const COST_ACTIONABILITY: Record<CostBand, number> = {
  free: 1.4,
  under_100: 1.3,
  "100_500": 1.1,
  "500_2000": 0.9,
  over_2000: 0.7,
};

const CONFIDENCE_WEIGHT: Record<SnapshotAction["confidence"], number> = {
  high: 1.2,
  medium: 1.0,
  low: 0.85,
};

function relevanceBonus(rule: Rule, a: Answers): number {
  let bonus = 0;
  const goals = Array.isArray(a.primary_goals) ? a.primary_goals : [];
  if (rule.goals?.some((g) => goals.includes(g))) bonus += 1.5;

  // Family sensitivity boosts safety and air actions.
  const hasVulnerable =
    has(a.household_composition, "young_children") ||
    has(a.household_composition, "older_adults") ||
    has(a.household_considerations, "mobility");
  if (hasVulnerable && (rule.safety || rule.categories.includes("air"))) bonus += 0.75;

  return bonus;
}

function score(rule: Rule, a: Answers): number {
  return (
    rule.impact * CONFIDENCE_WEIGHT[rule.confidence] * COST_ACTIONABILITY[rule.costBand] +
    relevanceBonus(rule, a)
  );
}

function toAction(rule: Rule, a: Answers): SnapshotAction {
  const isRenter = eq(a.own_or_rent, "rent");
  // For renters, structural/system work becomes a landlord conversation.
  const professionalNote =
    isRenter && !rule.diyFriendly
      ? `${rule.professionalNote ?? ""} As a renter, this is worth raising with your landlord or property manager.`.trim()
      : rule.professionalNote;
  return {
    id: rule.id,
    title: rule.title,
    why: rule.why,
    effort: rule.effort,
    costBand: rule.costBand,
    diyFriendly: rule.diyFriendly && !eq(a.diy_comfort, "none") ? true : rule.diyFriendly,
    categories: rule.categories,
    confidence: rule.confidence,
    professionalNote,
    steps: rule.steps,
  };
}

export type RecommendationResult = {
  topActions: SnapshotAction[];
  later: { title: string; why?: string }[];
};

/**
 * Selects exactly three prioritized actions plus a "later" list.
 * - Prefers no-/low-cost actions first (via cost actionability weighting).
 * - Guarantees at least one action fits the user's stated budget (unless a
 *   safety action is triggered and must stay in the top three).
 * - Keeps a triggered life-safety action in the top three.
 */
export function selectRecommendations(a: Answers): RecommendationResult {
  const triggered = RULES.filter((r) => r.trigger(a));
  const pool = triggered.length > 0 ? triggered : RULES;
  const ranked = [...pool].sort((x, y) => score(y, a) - score(x, a));

  let top = ranked.slice(0, 3);

  // Guarantee budget-feasibility of at least one action.
  const budget = budgetRank(typeof a.budget === "string" ? a.budget : undefined);
  const anyFeasible = top.some((r) => costRank(r.costBand) <= budget);
  const hasSafety = ranked.some((r) => r.safety && top.includes(r));
  if (!anyFeasible && !hasSafety) {
    const alt = ranked.find((r) => costRank(r.costBand) <= budget && !top.includes(r));
    if (alt) top = [...top.slice(0, 2), alt];
  }

  // Keep a triggered safety action in the top three.
  const safetyRule = ranked.find((r) => r.safety && r.trigger(a));
  if (safetyRule && !top.includes(safetyRule)) {
    top = [safetyRule, ...top.slice(0, 2)];
  }

  const later = ranked
    .filter((r) => !top.includes(r))
    .slice(0, 4)
    .map((r) => ({ title: r.title, why: r.why }));

  return { topActions: top.map((r) => toAction(r, a)), later };
}
