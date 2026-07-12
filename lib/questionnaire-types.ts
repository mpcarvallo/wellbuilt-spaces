export type QuestionType =
  | "multi-select"
  | "single-select"
  | "open-text"
  | "rating"
  | "email";

/** Raw in-progress answers, keyed by question id. Shape loosened for flexible editing; narrowed into QuestionnaireResponse on submit. */
export type Answers = {
  [key: string]: string | string[] | number | undefined;
};

export type Question = {
  id: string;
  type: QuestionType;
  /** Question copy. Can depend on prior answers (e.g. renter-friendly wording). */
  label: (answers: Answers) => string;
  helperText?: (answers: Answers) => string | undefined;
  /** Static option list, or a function that reorders/filters options based on prior answers. */
  options?: string[] | ((answers: Answers) => string[]);
  maxSelect?: number;
  required?: boolean;
  placeholder?: string;
  ratingLabels?: { min: string; max: string };
  /** Only render this question when the predicate is true. */
  showIf?: (answers: Answers) => boolean;
};

export type Section = {
  id: string;
  step: number;
  title: string;
  helperText: string;
  questions: Question[];
};

export type QuestionnaireResponse = {
  responseId: string;
  createdAt: string;

  // Section 1 — About you and your home
  userType: string[];
  homeType: string;
  homeAge: string;
  householdMembers: string[];

  // Section 2 — Biggest home challenges
  topFrustrations: string[];
  oneInstantImprovement: string;
  projectDelay: string;
  blockers: string[];
  urgencyScore: number | null;
  rentalPropertyCondition?: string;
  tenantHealthConcerns?: string[];

  // Section 3 — Healthy home awareness
  healthyHomeAwareness: string;
  healthyHomePriorities: string[];
  healthyPurchaseHistory: string[];
  materialConfidence: number | null;
  confusingAdvice: string;

  // Section 4 — Renovation and decision-making
  upcomingProjects: string[];
  budgetRange: string;
  designConfidence: number | null;
  confidenceHelpers: string[];
  fearedMistake: string;

  // Section 5 — AI and digital tools
  aiUsage: string;
  aiUseCases: string[];
  aiConcerns: string[];
  aiTrustScore: number | null;
  trustBuilders: string[];

  // Section 6 — Product and pricing validation
  productInterest: string[];
  firstProductChoice: string;
  priceRange: string;
  preferredFormat: string;
  paymentTrigger: string;
  purchaseObjection: string;

  // Section 7 — Early access and interviews
  earlyAccess: string;
  email?: string;
  interviewInterest: string;
  finalNotes: string;
};
