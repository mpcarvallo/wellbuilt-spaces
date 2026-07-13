/**
 * Assembles the deterministic Home Snapshot from a set of answers.
 *
 * This is both the default result and the fallback the results page uses when
 * the AI endpoint is unavailable, so the experience always works with no API
 * key. Language is educational and non-diagnostic by construction.
 */

import { questionnaireV4 } from "@/data/questionnaire-v4";
import type { Answers } from "@/types/questionnaire";
import { SCHEMA_VERSION, type Snapshot } from "@/types/home-profile";
import { selectRecommendations } from "@/lib/recommendations";
import { computeIndicators, rankedByAttention, RULES_VERSION } from "@/lib/scoring";
import { isAnswered } from "@/lib/profile";

export const DISCLAIMER =
  "This is educational guidance based only on the information you provided. It is not a physical inspection, environmental test, certification, diagnosis, or medical advice. A qualified professional can confirm anything that can't be verified from a questionnaire.";

const GOAL_LABELS: Record<string, string> = {
  sleep: "better sleep",
  air: "cleaner-feeling air",
  allergies: "fewer allergy triggers",
  stress: "less stress and clutter",
  focus: "better focus",
  materials: "safer material choices",
  sustainability: "lower energy and water use",
  renovation: "a healthier renovation",
  maintenance: "fewer maintenance surprises",
  family_support: "support for your family",
};

/** Questions worth answering to sharpen results, if the user skipped them. */
const HIGH_SIGNAL_IDS = [
  "stove_type",
  "kitchen_exhaust",
  "moisture",
  "hvac_filter",
  "drinking_water",
  "safety_checks",
  "bedroom_sleep",
];

function buildIntro(answers: Answers): string {
  const goals = Array.isArray(answers.primary_goals) ? answers.primary_goals : [];
  const goalPhrase =
    goals.length > 0 ? GOAL_LABELS[goals[0]] ?? "your priorities" : "your priorities";
  const focus = rankedByAttention(answers)[0];
  const focusPhrase = focus ? focus.label.toLowerCase() : "a few practical areas";
  return `Based on your answers, here are three practical places to start—focused on ${focusPhrase} and your goal of ${goalPhrase}.`;
}

function buildMissingInfo(answers: Answers): string[] {
  const byId = Object.fromEntries(questionnaireV4.map((q) => [q.id, q]));
  return HIGH_SIGNAL_IDS.filter((id) => !isAnswered(answers[id]))
    .map((id) => byId[id]?.title)
    .filter((t): t is string => Boolean(t))
    .slice(0, 3);
}

/** Deterministic Snapshot generator. */
export function generateSnapshot(answers: Answers): Snapshot {
  const { topActions, later } = selectRecommendations(answers);
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedBy: "rules",
    rulesVersion: RULES_VERSION,
    intro: buildIntro(answers),
    topActions,
    later,
    missingInfo: buildMissingInfo(answers),
    indicators: computeIndicators(answers),
    disclaimer: DISCLAIMER,
  };
}
