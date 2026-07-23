import type { Answers } from "@/types/questionnaire";

/** A single completed questionnaire, stored so the site owner can review it later. */
export type SubmissionRecord = {
  id: string;
  email: string;
  answers: Answers;
  createdAt: string;
};
