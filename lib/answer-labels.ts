import { questionnaireV4 } from "@/data/questionnaire-v4";
import type { Answers, Question } from "@/types/questionnaire";

const QUESTION_BY_ID = new Map(questionnaireV4.map((q) => [q.id, q]));

/** Looks up the human-readable option label for a raw answer value. Falls back to the raw value if unmatched. */
export function labelForValue(questionId: string, value: string): string {
  const question = QUESTION_BY_ID.get(questionId);
  const option = question?.options?.find((o) => o.value === value);
  return option?.label ?? value;
}

export function labelsForValues(questionId: string, values: string[]): string[] {
  return values.map((v) => labelForValue(questionId, v));
}

/**
 * Renders a single answer for display (Review screen, completion-notify email).
 * "—" for unanswered; option labels for select-type questions; "N / 5" for scale.
 */
export function displayAnswer(question: Question, answers: Answers): string {
  const v = answers[question.id];
  if (v === undefined || (Array.isArray(v) && v.length === 0) || v === "") {
    return "—";
  }
  if (question.type === "scale" && typeof v === "number") {
    return `${v} / 5`;
  }
  const labelFor = (val: string) =>
    question.options?.find((o) => o.value === val)?.label ?? val;
  if (Array.isArray(v)) return v.map(labelFor).join(", ");
  if (typeof v === "string") return question.options ? labelFor(v) : v;
  return String(v);
}
