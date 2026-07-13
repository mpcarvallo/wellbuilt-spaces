import { Answers, WellBuiltValidationResponseV3 } from "./questionnaire-types";

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined;
const arr = (v: unknown): string[] | undefined =>
  Array.isArray(v) && v.length > 0 ? (v as string[]) : undefined;
const num = (v: unknown): number | undefined => (typeof v === "number" ? v : undefined);

export type ResponseMeta = {
  responseId: string;
  startedAt: string;
  completedAt?: string;
  completionStatus: "started" | "completed";
};

/**
 * Maps in-progress answers into the versioned V3 research payload.
 *
 * This is research data only: no Healthy Home Score, category scores, health
 * labels, or derived diagnostic fields are computed or stored. Open-text
 * answers (attemptedOrResearched, wishSomeoneWouldTellMe, willingnessToPayReason,
 * distrustReason, architectQuestion, ...) are stored verbatim, never summarized.
 */
export function buildResponse(
  answers: Answers,
  meta: ResponseMeta
): WellBuiltValidationResponseV3 {
  return {
    questionnaireVersion: "wellbuilt-validation-v3",
    responseId: meta.responseId,
    startedAt: meta.startedAt,
    completedAt: meta.completedAt,
    completionStatus: meta.completionStatus,

    home: {
      currentSituation: str(answers.currentSituation),
      homeType: str(answers.homeType),
      homeAge: str(answers.homeAge),
      expectedStay: str(answers.expectedStay),
    },

    people: {
      householdMembers: arr(answers.householdMembers),
      currentPriorities: arr(answers.currentPriorities),
      needsInfluenceDecisions: str(answers.needsInfluenceDecisions),
      decisionInfluencingNeeds: arr(answers.decisionInfluencingNeeds),
    },

    space: {
      regularlyNoticedIssues: arr(answers.regularlyNoticedIssues),
      biggestDailyIssue: str(answers.biggestDailyIssue),
      improvementAttempt: str(answers.improvementAttempt),
      attemptedOrResearched: str(answers.attemptedOrResearched),
    },

    decisions: {
      delayedDecision: str(answers.delayedDecision),
      delayedDecisionDescription: str(answers.delayedDecisionDescription),
      decisionDifficulties: arr(answers.decisionDifficulties),
      adviceSources: arr(answers.adviceSources),
      adviceVsMarketingConfidence: num(answers.adviceVsMarketingConfidence),
    },

    plans: {
      projectsNext12Months: str(answers.projectsNext12Months),
      upcomingProjects: arr(answers.upcomingProjects),
      hardestUpcomingDecision: str(answers.hardestUpcomingDecision),
      comparisonPriorities: arr(answers.comparisonPriorities),
      wishSomeoneWouldTellMe: str(answers.wishSomeoneWouldTellMe),
    },

    concept: {
      usefulnessRating: num(answers.usefulnessRating),
      mostValuableParts: arr(answers.mostValuableParts),
      mostLikelyProduct: str(answers.mostLikelyProduct),
      preferredRecommendationFormat: str(answers.preferredRecommendationFormat),
    },

    value: {
      reasonableOneTimePrice: str(answers.reasonableOneTimePrice),
      willingnessToPayReason: str(answers.willingnessToPayReason),
      distrustReason: str(answers.distrustReason),
    },

    research: {
      architectQuestion: str(answers.architectQuestion),
      earlyAccessInterest: str(answers.earlyAccessInterest),
      email: str(answers.email),
      interviewInterest: str(answers.interviewInterest),
    },
  };
}
