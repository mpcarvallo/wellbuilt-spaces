export type QuestionType =
  | "multi-select"
  | "single-select"
  | "open-text"
  | "rating"
  | "email";

/** Raw in-progress answers, keyed by question id. Shape loosened for flexible editing; narrowed into WellBuiltValidationResponseV3 on submit. */
export type Answers = {
  [key: string]: string | string[] | number | undefined;
};

export type Question = {
  id: string;
  type: QuestionType;
  /** Question copy. Can depend on prior answers (e.g. renter-friendly wording). */
  label: (answers: Answers) => string;
  helperText?: (answers: Answers) => string | undefined;
  placeholder?: string;
  /** Static option list, or a function that derives options from prior answers (e.g. dynamic Q9/Q18). */
  options?: string[] | ((answers: Answers) => string[]);
  maxSelect?: number;
  /**
   * Options that are mutually exclusive with all other options in a multi-select.
   * Selecting one clears the rest; selecting any other option clears these.
   * Used for Q8 "None of these".
   */
  exclusiveOptions?: string[];
  required?: boolean;
  ratingLabels?: { min: string; max: string };
  /** Only render this question when the predicate is true. */
  showIf?: (answers: Answers) => boolean;
};

export type ConceptCard = {
  eyebrow?: string;
  body: string[];
};

export type Section = {
  id: string;
  /** Progress stage (1-6). Value and Final share the WellBuilt stage. */
  step: number;
  /** Short label shown in the progress bar (Home, People, Space, ...). */
  progressLabel: string;
  /** Descriptive section heading shown above the questions. */
  title: string;
  helperText: string;
  /** Optional concept card rendered above the questions (Section 6 — WellBuilt). */
  conceptCard?: ConceptCard;
  questions: Question[];
};

/**
 * Versioned research response (V3).
 *
 * This is a research/validation payload only. It intentionally stores NO
 * Healthy Home Score, category scores, health-risk labels, or derived
 * diagnostic fields. Open-text answers are preserved exactly as entered.
 */
export type WellBuiltValidationResponseV3 = {
  questionnaireVersion: "wellbuilt-validation-v3";
  responseId: string;
  startedAt: string;
  completedAt?: string;
  completionStatus: "started" | "completed";

  home: {
    currentSituation?: string;
    homeType?: string;
    homeAge?: string;
    expectedStay?: string;
  };

  people: {
    householdMembers?: string[];
    currentPriorities?: string[];
    needsInfluenceDecisions?: string;
    decisionInfluencingNeeds?: string[];
  };

  space: {
    regularlyNoticedIssues?: string[];
    biggestDailyIssue?: string;
    improvementAttempt?: string;
    attemptedOrResearched?: string;
  };

  decisions: {
    delayedDecision?: string;
    delayedDecisionDescription?: string;
    decisionDifficulties?: string[];
    adviceSources?: string[];
    adviceVsMarketingConfidence?: number;
  };

  plans: {
    projectsNext12Months?: string;
    upcomingProjects?: string[];
    hardestUpcomingDecision?: string;
    comparisonPriorities?: string[];
    wishSomeoneWouldTellMe?: string;
  };

  concept: {
    usefulnessRating?: number;
    mostValuableParts?: string[];
    mostLikelyProduct?: string;
    preferredRecommendationFormat?: string;
  };

  value: {
    reasonableOneTimePrice?: string;
    willingnessToPayReason?: string;
    distrustReason?: string;
  };

  research: {
    architectQuestion?: string;
    earlyAccessInterest?: string;
    email?: string;
    interviewInterest?: string;
  };
};
