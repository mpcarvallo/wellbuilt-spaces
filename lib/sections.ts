import { questionnaireV4 } from "@/data/questionnaire-v4";
import type { Answers, Question } from "@/types/questionnaire";
import { isAnswered } from "@/lib/profile";

/** A questionnaire "screen": consecutive questions sharing a module label. */
export type QuestionnaireSection = {
  module: string;
  questions: Question[];
};

/** Groups the flat V4 question list into section-per-screen groups by module (order preserved). */
export function getSections(): QuestionnaireSection[] {
  const sections: QuestionnaireSection[] = [];
  for (const q of questionnaireV4) {
    const last = sections[sections.length - 1];
    if (last && last.module === q.module) {
      last.questions.push(q);
    } else {
      sections.push({ module: q.module, questions: [q] });
    }
  }
  return sections;
}

export const SECTIONS: QuestionnaireSection[] = getSections();
export const TOTAL_STEPS = SECTIONS.length;

/** Human-friendly labels for the 1–5 scale questions (data has no option list). */
export const SCALE_LABELS: Record<string, { min: string; max: string }> = {
  bedroom_sleep: { min: "Not restorative", max: "Very restorative" },
  maintenance_confidence: { min: "Not confident", max: "Very confident" },
};

/** Multi-select option values that clear all other selections when chosen. */
export const EXCLUSIVE_VALUES = new Set(["none"]);

export function isQuestionValid(question: Question, answers: Answers): boolean {
  if (!question.required) return true;
  return isAnswered(answers[question.id]);
}

export function isSectionValid(section: QuestionnaireSection, answers: Answers): boolean {
  return section.questions.every((q) => isQuestionValid(q, answers));
}

export function invalidQuestionIds(section: QuestionnaireSection, answers: Answers): string[] {
  return section.questions.filter((q) => !isQuestionValid(q, answers)).map((q) => q.id);
}
