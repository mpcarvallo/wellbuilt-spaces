import { questionnaireV4 } from "@/data/questionnaire-v4";

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
