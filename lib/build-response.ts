import { Answers, QuestionnaireResponse } from "./questionnaire-types";

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const arr = (v: unknown): string[] => (Array.isArray(v) ? v : []);
const num = (v: unknown): number | null => (typeof v === "number" ? v : null);

export function buildResponse(answers: Answers): QuestionnaireResponse {
  return {
    responseId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `resp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),

    userType: arr(answers.userType),
    homeType: str(answers.homeType),
    homeAge: str(answers.homeAge),
    householdMembers: arr(answers.householdMembers),

    topFrustrations: arr(answers.topFrustrations),
    oneInstantImprovement: str(answers.oneInstantImprovement),
    projectDelay: str(answers.projectDelay),
    blockers: arr(answers.blockers),
    urgencyScore: num(answers.urgencyScore),
    rentalPropertyCondition: str(answers.rentalPropertyCondition) || undefined,
    tenantHealthConcerns: arr(answers.tenantHealthConcerns).length
      ? arr(answers.tenantHealthConcerns)
      : undefined,

    healthyHomeAwareness: str(answers.healthyHomeAwareness),
    healthyHomePriorities: arr(answers.healthyHomePriorities),
    healthyPurchaseHistory: arr(answers.healthyPurchaseHistory),
    materialConfidence: num(answers.materialConfidence),
    confusingAdvice: str(answers.confusingAdvice),

    upcomingProjects: arr(answers.upcomingProjects),
    budgetRange: str(answers.budgetRange),
    designConfidence: num(answers.designConfidence),
    confidenceHelpers: arr(answers.confidenceHelpers),
    fearedMistake: str(answers.fearedMistake),

    aiUsage: str(answers.aiUsage),
    aiUseCases: arr(answers.aiUseCases),
    aiConcerns: arr(answers.aiConcerns),
    aiTrustScore: num(answers.aiTrustScore),
    trustBuilders: arr(answers.trustBuilders),

    productInterest: arr(answers.productInterest),
    firstProductChoice: str(answers.firstProductChoice),
    priceRange: str(answers.priceRange),
    preferredFormat: str(answers.preferredFormat),
    paymentTrigger: str(answers.paymentTrigger),
    purchaseObjection: str(answers.purchaseObjection),

    earlyAccess: str(answers.earlyAccess),
    email: str(answers.email) || undefined,
    interviewInterest: str(answers.interviewInterest),
    finalNotes: str(answers.finalNotes),
  };
}
