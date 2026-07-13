import { Answers, Question, Section } from "./questionnaire-types";

/** Options carried over from a prior multi-select answer, used for dynamic single-selects (Q9, Q18). */
function fromPriorSelection(
  answers: Answers,
  sourceId: string,
  exclude: string[] = []
): string[] {
  const raw = answers[sourceId];
  if (!Array.isArray(raw)) return [];
  return raw.filter((o) => !exclude.includes(o));
}

// ---------------------------------------------------------------------------
// SECTION 1 — HOME
// ---------------------------------------------------------------------------
const home: Question[] = [
  {
    id: "currentSituation",
    type: "single-select",
    label: () => "Which best describes your current situation?",
    required: true,
    options: [
      "I own my home",
      "I rent my home",
      "I am planning to buy",
      "I own an investment property",
      "Other",
    ],
  },
  {
    id: "homeType",
    type: "single-select",
    label: () => "What type of home do you live in?",
    required: true,
    options: [
      "Apartment",
      "Condo",
      "Townhouse",
      "Single-family home",
      "Two- to four-unit building",
      "Other",
      "Not sure",
    ],
  },
  {
    id: "homeAge",
    type: "single-select",
    label: () => "Approximately how old is your home?",
    options: [
      "Less than 5 years",
      "5–20 years",
      "21–50 years",
      "51–100 years",
      "More than 100 years",
      "Not sure",
    ],
  },
  {
    id: "expectedStay",
    type: "single-select",
    label: () => "How long do you expect to stay in your current home?",
    options: ["Less than 1 year", "1–3 years", "4–7 years", "8+ years", "Not sure"],
  },
];

// ---------------------------------------------------------------------------
// SECTION 2 — PEOPLE
// ---------------------------------------------------------------------------
const people: Question[] = [
  {
    id: "householdMembers",
    type: "multi-select",
    label: () => "Who lives in your home?",
    options: [
      "Just me",
      "Partner or spouse",
      "Baby or toddler",
      "School-age child",
      "Teenager",
      "Adult family members",
      "Older adult",
      "Pet",
    ],
  },
  {
    id: "currentPriorities",
    type: "multi-select",
    label: () => "Which everyday priorities matter most in your home right now?",
    helperText: () => "Select up to 5.",
    maxSelect: 5,
    options: [
      "Better sleep",
      "Cleaner-feeling indoor air",
      "Fewer odors, dust, or allergens",
      "More natural light",
      "Better lighting",
      "Less noise",
      "More comfortable temperatures",
      "Easier cleaning and maintenance",
      "Less clutter",
      "Better organization",
      "Spaces that better support children",
      "Better focus or work-from-home spaces",
      "More calming or less overstimulating spaces",
      "More confidence in material choices",
      "Lower energy use",
      "Preparing the home for aging",
      "Other",
    ],
  },
  {
    id: "needsInfluenceDecisions",
    type: "single-select",
    label: () =>
      "Do the needs or preferences of anyone in your household significantly influence home or material decisions?",
    options: ["Yes", "No", "Prefer not to say"],
  },
  {
    id: "decisionInfluencingNeeds",
    type: "multi-select",
    label: () => "What types of needs or preferences influence your decisions?",
    showIf: (answers) => answers.needsInfluenceDecisions === "Yes",
    options: [
      "Sensitivity to odors",
      "Sensitivity to noise",
      "Sensitivity to light or glare",
      "Allergy-related concerns",
      "Mobility or accessibility needs",
      "Sensory preferences",
      "Sleep-related priorities",
      "Focus or attention needs",
      "Young children in the home",
      "Older adults in the home",
      "Other",
      "Prefer not to say",
    ],
  },
];

// ---------------------------------------------------------------------------
// SECTION 3 — SPACE
// ---------------------------------------------------------------------------
const NONE_OF_THESE = "None of these";

const space: Question[] = [
  {
    id: "regularlyNoticedIssues",
    type: "multi-select",
    label: () => "Which of these do you notice regularly?",
    exclusiveOptions: [NONE_OF_THESE],
    options: [
      "Some rooms feel too dark",
      "Some rooms are too bright or have glare",
      "Rooms feel too hot or too cold",
      "Temperatures vary significantly between rooms",
      "Condensation appears on windows",
      "The home sometimes feels humid or damp",
      "There are recurring musty or unusual odors",
      "Dust builds up quickly",
      "Outside or indoor noise is disruptive",
      "Storage does not match how we live",
      "Some spaces are difficult to clean or maintain",
      "Furniture or layout makes movement awkward",
      "I struggle to find calm or quiet spaces",
      "Some spaces feel visually overwhelming or overstimulating",
      "Work or homework spaces do not function well",
      NONE_OF_THESE,
      "Other",
    ],
  },
  {
    id: "biggestDailyIssue",
    type: "single-select",
    label: () => "Which ONE issue affects everyday life in your home the most?",
    // Dynamic: choices are the Q8 selections, excluding "None of these".
    options: (answers) =>
      fromPriorSelection(answers, "regularlyNoticedIssues", [NONE_OF_THESE]),
    showIf: (answers) =>
      fromPriorSelection(answers, "regularlyNoticedIssues", [NONE_OF_THESE]).length > 0,
  },
  {
    id: "improvementAttempt",
    type: "single-select",
    label: () => "Have you tried to improve this issue?",
    showIf: (answers) =>
      typeof answers.biggestDailyIssue === "string" && answers.biggestDailyIssue.length > 0,
    options: [
      "Yes, and it helped",
      "Yes, but it did not fully solve the problem",
      "I researched solutions but did not act",
      "No, I do not know where to start",
      "No, it is not a priority yet",
    ],
  },
  {
    id: "attemptedOrResearched",
    type: "open-text",
    label: () => "Tell us briefly what you tried, considered, or searched for.",
    placeholder: "What you tried, considered, or searched for...",
    showIf: (answers) =>
      answers.improvementAttempt === "Yes, and it helped" ||
      answers.improvementAttempt === "Yes, but it did not fully solve the problem" ||
      answers.improvementAttempt === "I researched solutions but did not act",
  },
];

// ---------------------------------------------------------------------------
// SECTION 4 — DECISIONS
// ---------------------------------------------------------------------------
const decisions: Question[] = [
  {
    id: "delayedDecision",
    type: "single-select",
    label: () =>
      "In the past year, have you delayed a home purchase or improvement because you were unsure what to choose or what to prioritize?",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "delayedDecisionDescription",
    type: "open-text",
    label: () => "What decision were you trying to make?",
    helperText: () =>
      "For example: choosing paint, replacing flooring, improving a child's room, buying an air purifier, planning lighting, selecting a countertop, or deciding whether a renovation was worth it.",
    showIf: (answers) => answers.delayedDecision === "Yes",
  },
  {
    id: "decisionDifficulties",
    type: "multi-select",
    label: () => "What made the decision difficult?",
    helperText: () => "Select up to 4.",
    maxSelect: 4,
    showIf: (answers) => answers.delayedDecision === "Yes",
    options: [
      "Too many options",
      "Conflicting information online",
      "I did not know which sources to trust",
      "I could not tell whether the change would meaningfully improve everyday life",
      "I could not tell whether the upgrade was worth the cost",
      "I did not understand the material or product claims",
      "I was worried about making an expensive mistake",
      "Advice was too generic for my home or household",
      "I did not know what to prioritize first",
      "I needed to balance budget, quality, and wellbeing",
      "I needed to consider my family's specific needs",
      "I did not have time to research",
      "Other",
    ],
  },
  {
    id: "adviceSources",
    type: "multi-select",
    label: () => "Where do you currently go for home advice?",
    options: [
      "Google",
      "ChatGPT or another AI tool",
      "YouTube",
      "Instagram",
      "Pinterest",
      "Reddit",
      "Home improvement store",
      "Contractor",
      "Architect or interior designer",
      "Friends or family",
      "Product reviews",
      "Manufacturer websites",
      "Other",
    ],
  },
  {
    id: "adviceVsMarketingConfidence",
    type: "rating",
    label: () =>
      "How confident are you that you can tell the difference between useful guidance, product marketing, and generic advice?",
    ratingLabels: { min: "Not confident at all", max: "Very confident" },
  },
];

// ---------------------------------------------------------------------------
// SECTION 5 — PLANS
// ---------------------------------------------------------------------------
const plans: Question[] = [
  {
    id: "projectsNext12Months",
    type: "single-select",
    label: () => "Are you planning any home purchases or projects in the next 12 months?",
    options: ["Yes", "Maybe", "No"],
  },
  {
    id: "upcomingProjects",
    type: "multi-select",
    label: () => "What are you considering?",
    showIf: (answers) =>
      answers.projectsNext12Months === "Yes" || answers.projectsNext12Months === "Maybe",
    options: [
      "Painting",
      "Flooring",
      "Kitchen updates",
      "Bathroom updates",
      "Lighting",
      "Furniture",
      "Mattress or bedroom products",
      "Storage or organization",
      "Home office",
      "Child's room or family space",
      "Basement",
      "Windows or doors",
      "Heating, cooling, or ventilation",
      "Buying a home",
      "Larger renovation",
      "Other",
    ],
  },
  {
    id: "hardestUpcomingDecision",
    type: "single-select",
    label: () => "Which upcoming decision feels hardest right now?",
    // Dynamic: choices are the Q17 selections.
    options: (answers) => fromPriorSelection(answers, "upcomingProjects"),
    showIf: (answers) => fromPriorSelection(answers, "upcomingProjects").length > 0,
  },
  {
    id: "comparisonPriorities",
    type: "multi-select",
    label: () =>
      "When comparing home products, materials, or improvement options, what matters most to you?",
    helperText: () => "Select up to 5.",
    maxSelect: 5,
    options: [
      "Price",
      "Durability",
      "Appearance",
      "Ease of maintenance",
      "Installation difficulty",
      "How the choice may affect indoor air",
      "Material ingredients or emissions",
      "Sustainability",
      "Energy performance",
      "Comfort or sensory experience",
      "How well it supports my household's needs",
      "Longevity",
      "Resale value",
      "Professional recommendation",
      "Verified certifications or standards",
    ],
  },
  {
    id: "wishSomeoneWouldTellMe",
    type: "open-text",
    label: () =>
      "What do you wish someone would tell you before you spend money on your next home project?",
    placeholder: "In your own words...",
  },
];

// ---------------------------------------------------------------------------
// SECTION 6 — WELLBUILT
// ---------------------------------------------------------------------------
const concept: Question[] = [
  {
    id: "usefulnessRating",
    type: "rating",
    label: () => "How useful would this be to you?",
    ratingLabels: { min: "Not useful", max: "Extremely useful" },
  },
  {
    id: "mostValuableParts",
    type: "multi-select",
    label: () => "Which part sounds most valuable?",
    helperText: () => "Select up to 3.",
    maxSelect: 3,
    options: [
      "Knowing what to prioritize first",
      "Getting guidance based on my specific home and household",
      "Comparing materials or products through more than just price and appearance",
      "Understanding tradeoffs",
      "Avoiding expensive mistakes",
      "Knowing what may not be worth spending money on",
      "Understanding how a decision may affect comfort or everyday wellbeing",
      "Creating a step-by-step project plan",
      "Getting questions to ask a contractor",
      "Making more informed material choices",
      "Balancing budget, durability, wellbeing, and sustainability",
      "Other",
    ],
  },
  {
    id: "mostLikelyProduct",
    type: "single-select",
    label: () => "Which would you be most likely to use?",
    options: [
      "A free personalized Home Snapshot",
      "A personalized Home Priorities Plan",
      "A tool to compare two materials or home options",
      "A wellness-informed renovation decision planner",
      "An AI home decision advisor",
      "A room-specific planning guide",
      "None of these",
    ],
  },
  {
    id: "preferredRecommendationFormat",
    type: "single-select",
    label: () => "How would you prefer to receive personalized home guidance?",
    options: [
      "Interactive online results",
      "Downloadable PDF plan",
      "AI chat or advisor",
      "Email recommendations over several days",
      "A digital workbook or toolkit",
      "No preference",
    ],
  },
];

// ---------------------------------------------------------------------------
// SECTION 7 — VALUE
// ---------------------------------------------------------------------------
const value: Question[] = [
  {
    id: "reasonableOneTimePrice",
    type: "single-select",
    label: () =>
      "If a personalized plan helped you prioritize home improvements, consider wellbeing and material tradeoffs, and avoid unnecessary spending, what would feel like a reasonable one-time price?",
    options: [
      "I would only use a free version",
      "Under $25",
      "$25–49",
      "$50–99",
      "$100–199",
      "$200+",
    ],
  },
  {
    id: "willingnessToPayReason",
    type: "open-text",
    label: () =>
      "What would make personalized home decision support valuable enough for you to pay for?",
    placeholder: "In your own words...",
  },
  {
    id: "distrustReason",
    type: "open-text",
    label: () => "What would make you NOT trust a tool like this?",
    placeholder: "In your own words...",
  },
];

// ---------------------------------------------------------------------------
// SECTION 8 — FINAL
// ---------------------------------------------------------------------------
const final: Question[] = [
  {
    id: "architectQuestion",
    type: "open-text",
    label: () =>
      "If you could ask an architect one question about making your home better support the way you live, what would you ask?",
    placeholder: "Your question...",
  },
  {
    id: "earlyAccessInterest",
    type: "single-select",
    label: () => "Would you like early access to the WellBuilt Home Snapshot?",
    options: ["Yes", "Maybe", "No"],
  },
  {
    id: "email",
    type: "email",
    label: () => "Where should we send your early access?",
    helperText: () =>
      "We'll only use your email to share WellBuilt Spaces updates and early-access opportunities.",
    required: true,
    showIf: (answers) =>
      answers.earlyAccessInterest === "Yes" || answers.earlyAccessInterest === "Maybe",
  },
  {
    id: "interviewInterest",
    type: "single-select",
    label: () => "Would you be open to a short 20-minute research conversation?",
    options: ["Yes", "Maybe", "No"],
  },
];

export const sections: Section[] = [
  {
    id: "home",
    step: 1,
    progressLabel: "Home",
    title: "First, tell us a little about your home.",
    helperText: "A few basics to help us understand your space.",
    questions: home,
  },
  {
    id: "people",
    step: 2,
    progressLabel: "People",
    title: "A home should support the people living in it.",
    helperText: "Who it's for, and what matters most to them right now.",
    questions: people,
  },
  {
    id: "space",
    step: 3,
    progressLabel: "Space",
    title: "Now think about how your home feels and functions day to day.",
    helperText: "What you notice, and whether you've tried to change it.",
    questions: space,
  },
  {
    id: "decisions",
    step: 4,
    progressLabel: "Decisions",
    title: "Home decisions can get complicated quickly.",
    helperText: "How you decide, and where it gets hard.",
    questions: decisions,
  },
  {
    id: "plans",
    step: 5,
    progressLabel: "Plans",
    title: "What decisions are coming next?",
    helperText: "Projects on your horizon and what you weigh when comparing options.",
    questions: plans,
  },
  {
    id: "wellbuilt",
    step: 6,
    progressLabel: "WellBuilt",
    title: "Imagine a different way to make home decisions.",
    helperText: "A quick reaction to what we're exploring.",
    conceptCard: {
      eyebrow: "WellBuilt Spaces",
      body: [
        "A personalized home decision tool that considers your home, household priorities, budget, and upcoming projects to help you understand what to prioritize, what to consider, and what may not be worth your money right now.",
        "Built around architectural thinking and trusted public guidance—not sensors, home testing, or generic product lists.",
      ],
    },
    questions: concept,
  },
  {
    id: "value",
    step: 6,
    progressLabel: "WellBuilt",
    title: "One last question about value.",
    helperText: "What this kind of support might be worth to you.",
    questions: value,
  },
  {
    id: "final",
    step: 6,
    progressLabel: "WellBuilt",
    title: "Help us build something genuinely useful.",
    helperText: "A few open questions, then you're done.",
    questions: final,
  },
];

/** Number of distinct progress stages (Home → People → Space → Decisions → Plans → WellBuilt). */
export const totalSteps = Math.max(...sections.map((s) => s.step));
