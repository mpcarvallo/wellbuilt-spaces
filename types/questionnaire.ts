/**
 * Questionnaire V4 type definitions.
 *
 * The questionnaire is data-driven: `data/questionnaire-v4.ts` is the single
 * source of truth for questions. Components render from these types and never
 * hard-code question definitions.
 */

/** Wellness "pillars" a question contributes to. Drives profile-based scoring. */
export type Pillar =
  | "lifestyle"
  | "air"
  | "water"
  | "light"
  | "comfort"
  | "materials"
  | "sustainability"
  | "maintenance";

export type QuestionType = "single" | "multi" | "text" | "scale";

export type QuestionOption = {
  label: string;
  value: string;
  /**
   * Optional risk weight (higher = more likely to warrant attention). Used only
   * for profile-based indicators, never as a measured or diagnostic value.
   */
  risk?: number;
};

export type Question = {
  id: string;
  /** Visible grouping label; consecutive questions with the same module form a section. */
  module: string;
  title: string;
  helper?: string;
  type: QuestionType;
  required?: boolean;
  /** Max selectable options for `multi` questions. */
  maxSelections?: number;
  /** Wellness pillar this question informs (used by scoring). */
  pillar?: Pillar;
  /** Options for `single` / `multi` questions. */
  options?: QuestionOption[];
};

/** Raw answer value for a single question, by question `type`. */
export type AnswerValue = string | string[] | number;

/** In-progress answers keyed by question id. */
export type Answers = Record<string, AnswerValue | undefined>;

/** Scale questions render a 1–5 selector. */
export const SCALE_MIN = 1;
export const SCALE_MAX = 5;
