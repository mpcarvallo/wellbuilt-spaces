import { Answers, Question, Section } from "./questionnaire-types";

const isRenter = (answers: Answers) =>
  Array.isArray(answers.userType) && answers.userType.includes("Renter");

const isInvestor = (answers: Answers) =>
  Array.isArray(answers.userType) &&
  answers.userType.includes("Real estate investor");

const isParent = (answers: Answers) =>
  Array.isArray(answers.userType) &&
  answers.userType.includes("Parent or caregiver");

/** Moves the given options to the front of the list, preserving relative order otherwise. */
function prioritize(options: string[], priorityOptions: string[]) {
  const priority = options.filter((o) => priorityOptions.includes(o));
  const rest = options.filter((o) => !priorityOptions.includes(o));
  return [...priority, ...rest];
}

const section1: Question[] = [
  {
    id: "userType",
    type: "multi-select",
    label: () => "Which best describes you?",
    required: true,
    options: [
      "Homeowner",
      "Renter",
      "Planning to buy a home",
      "Parent or caregiver",
      "Real estate investor",
      "Small business owner with a physical space",
      "Design/renovation enthusiast",
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
      "Duplex / multi-family",
      "Other",
    ],
  },
  {
    id: "homeAge",
    type: "single-select",
    label: () => "How old is your home?",
    options: ["Newer than 5 years", "5-20 years", "20-50 years", "50+ years", "Not sure"],
  },
  {
    id: "householdMembers",
    type: "multi-select",
    label: () => "Who lives in the home?",
    options: (answers) =>
      prioritize(
        [
          "Adults only",
          "Baby / toddler",
          "School-age child",
          "Teenager",
          "Older adult",
          "Person with allergies/asthma/sensitivities",
          "Pet",
          "Other",
        ],
        isParent(answers)
          ? ["Baby / toddler", "School-age child", "Teenager"]
          : []
      ),
  },
];

const section2: Question[] = [
  {
    id: "topFrustrations",
    type: "multi-select",
    label: () => "Which areas frustrate you most in your home right now?",
    helperText: () => "Choose up to 5.",
    required: true,
    maxSelect: 5,
    options: (answers) =>
      prioritize(
        [
          "Indoor air quality",
          "Dust or allergens",
          "Mold, moisture, or humidity",
          "Materials or chemical concerns",
          "Storage",
          "Clutter",
          "Lighting",
          "Noise",
          "Sleep environment",
          "Layout / flow",
          "Kitchen functionality",
          "Bathroom functionality",
          "Child-friendly spaces",
          "Home office setup",
          "Maintenance",
          "Energy bills",
          "Making design decisions",
        ],
        isParent(answers) ? ["Child-friendly spaces", "Indoor air quality"] : []
      ),
  },
  {
    id: "oneInstantImprovement",
    type: "open-text",
    label: () => "If you could instantly improve one thing in your home, what would it be?",
    placeholder: "Example: better storage, less dust, safer materials, calmer kids' room...",
    required: true,
  },
  {
    id: "projectDelay",
    type: "single-select",
    label: () => "Have you delayed a home project because you did not know where to start?",
    options: ["Yes, many times", "Yes, once or twice", "No", "Not sure"],
  },
  {
    id: "blockers",
    type: "multi-select",
    label: () => "What usually stops you from making home improvements?",
    options: (answers) =>
      prioritize(
        [
          "Too expensive",
          "Too many options",
          "Not enough time",
          "I do not know what products/materials to choose",
          "I do not know who to trust",
          "I am afraid of making costly mistakes",
          "My home feels overwhelming",
          "My partner/family and I disagree",
          "I need renter-friendly solutions",
          "Other",
        ],
        isRenter(answers) ? ["I need renter-friendly solutions"] : []
      ),
  },
  {
    id: "urgencyScore",
    type: "rating",
    label: () => "How painful or urgent does this feel right now?",
    required: true,
    ratingLabels: { min: "Not urgent", max: "I really want help soon" },
  },
  {
    id: "rentalPropertyCondition",
    type: "single-select",
    label: () => "What condition is your rental property generally in?",
    helperText: () => "Since you mentioned investing in rental property.",
    showIf: isInvestor,
    options: [
      "Excellent — recently updated",
      "Good — minor issues",
      "Fair — some deferred maintenance",
      "Poor — needs significant work",
      "Varies by property",
    ],
  },
  {
    id: "tenantHealthConcerns",
    type: "multi-select",
    label: () => "Have tenants raised any health or safety concerns?",
    showIf: isInvestor,
    options: [
      "Mold or moisture complaints",
      "Air quality or ventilation complaints",
      "Pest issues",
      "Safety hazards (railings, trip hazards, electrical)",
      "Noise complaints",
      "No concerns raised",
      "Not sure",
    ],
  },
];

const section3: Question[] = [
  {
    id: "healthyHomeAwareness",
    type: "single-select",
    label: () => 'Before today, had you heard the term "healthy home"?',
    options: [
      "Yes, and I know what it means",
      "Yes, but I am not totally sure what it includes",
      "No",
    ],
  },
  {
    id: "healthyHomePriorities",
    type: "multi-select",
    label: () => "Which healthy home topics matter most to you?",
    helperText: () => "Choose up to 5.",
    required: true,
    maxSelect: 5,
    options: (answers) =>
      prioritize(
        [
          "Better indoor air",
          "Low-VOC / safer materials",
          "Mold prevention",
          "Dust and allergens",
          "Water quality",
          "Non-toxic cleaning",
          "Sleep and circadian lighting",
          "Noise control",
          "Thermal comfort",
          "Child development / sensory-friendly spaces",
          "Aging-in-place safety",
          "Sustainability",
          "Energy efficiency",
        ],
        isParent(answers) ? ["Child development / sensory-friendly spaces"] : []
      ),
  },
  {
    id: "healthyPurchaseHistory",
    type: "multi-select",
    label: () => "Have you ever bought a product because it was advertised as healthier or safer?",
    options: [
      "Paint",
      "Flooring",
      "Furniture",
      "Mattress",
      "Cleaning products",
      "Air purifier",
      "Water filter",
      "Cookware",
      "Baby/child products",
      "No",
      "Other",
    ],
  },
  {
    id: "materialConfidence",
    type: "rating",
    label: () => "How confident are you that you can identify healthier materials/products?",
    ratingLabels: { min: "Not confident", max: "Very confident" },
  },
  {
    id: "confusingAdvice",
    type: "open-text",
    label: () => "What feels confusing about healthy home advice?",
  },
];

const section4: Question[] = [
  {
    id: "upcomingProjects",
    type: "multi-select",
    label: () => "Are you considering any home projects in the next 12 months?",
    required: true,
    options: (answers) =>
      prioritize(
        [
          "Paint",
          "Furniture/decor updates",
          "Kitchen update",
          "Bathroom update",
          "Lighting update",
          "Flooring",
          "Basement",
          "Kids' room",
          "Home office",
          "Storage/organization",
          "Air quality improvements",
          "Rental property improvements",
          "Whole-home remodel",
          "No specific project yet",
        ],
        isInvestor(answers)
          ? ["Rental property improvements"]
          : isParent(answers)
            ? ["Kids' room"]
            : []
      ),
  },
  {
    id: "budgetRange",
    type: "single-select",
    label: (answers) =>
      isRenter(answers)
        ? "What home improvement or setup budget feels realistic for your next project?"
        : "What budget range feels realistic for your next home project?",
    options: [
      "Under $250",
      "$250-$1,000",
      "$1,000-$5,000",
      "$5,000-$15,000",
      "$15,000-$50,000",
      "$50,000+",
      "Not sure",
    ],
  },
  {
    id: "designConfidence",
    type: "rating",
    label: () => "How confident do you feel making design and material decisions?",
    ratingLabels: { min: "I second-guess everything", max: "Very confident" },
  },
  {
    id: "confidenceHelpers",
    type: "multi-select",
    label: () => "What would make you feel more confident?",
    options: [
      "A clear step-by-step plan",
      "A vetted product/material list",
      "A budget calculator",
      "A checklist before buying",
      "AI help with options",
      "Architect-reviewed guidance",
      "Before/after examples",
      "A personalized room report",
      "Someone to review my plan",
    ],
  },
  {
    id: "fearedMistake",
    type: "open-text",
    label: () => "What is one mistake you worry about making?",
  },
];

const section5: Question[] = [
  {
    id: "aiUsage",
    type: "single-select",
    label: () =>
      "Have you used AI tools like ChatGPT, Claude, or Gemini for home/design questions?",
    options: ["Frequently", "Sometimes", "Once or twice", "Never"],
  },
  {
    id: "aiUseCases",
    type: "multi-select",
    label: () => "What did you use AI for?",
    helperText: () => "Tell us what worked, or didn't — this helps us build something better.",
    showIf: (answers) => typeof answers.aiUsage === "string" && answers.aiUsage !== "Never" && answers.aiUsage !== undefined,
    options: [
      "Design ideas",
      "Product research",
      "Budget planning",
      "DIY instructions",
      "Room layouts",
      "Material comparisons",
      "Contractor questions",
      "Maintenance questions",
      "Other",
    ],
  },
  {
    id: "aiConcerns",
    type: "multi-select",
    label: () => "What worries you about using AI for home improvement?",
    options: [
      "It may give wrong advice",
      "It may not understand my home",
      "It may suggest unsafe ideas",
      "It may not know real products/materials",
      "It may not match my budget",
      "I do not know how to prompt it",
      "I am not worried",
      "Other",
    ],
  },
  {
    id: "aiTrustScore",
    type: "rating",
    label: () =>
      "Would you trust an architect-reviewed AI tool to help plan healthier home improvements?",
    required: true,
    ratingLabels: { min: "I would not trust it", max: "I would be very interested" },
  },
  {
    id: "trustBuilders",
    type: "multi-select",
    label: () => "What would make an AI home tool feel trustworthy?",
    options: [
      "Clear sources",
      "Architect-reviewed guidance",
      "Product/material explanations",
      "Safety disclaimers",
      "Room-by-room recommendations",
      "Budget ranges",
      "Photos/examples",
      "Ability to upload room photos later",
      "Simple language",
    ],
  },
];

const section6: Question[] = [
  {
    id: "productInterest",
    type: "multi-select",
    label: () => "Which WellBuilt Spaces tools would interest you most?",
    helperText: () => "Choose up to 4.",
    required: true,
    maxSelect: 4,
    options: (answers) =>
      prioritize(
        [
          "Healthy Home Score",
          "Personalized Healthy Home Audit",
          "Room-by-room improvement plan",
          "Healthy materials guide",
          "Low-VOC product shopping guide",
          "Remodel planning toolkit",
          "DIY renovation roadmap",
          "Budget calculator",
          "Lighting planner",
          "Kids' room wellness guide",
          "Rental property healthy upgrade checklist",
          "AI prompt toolkit for home projects",
        ],
        isInvestor(answers)
          ? ["Rental property healthy upgrade checklist"]
          : isParent(answers)
            ? ["Kids' room wellness guide"]
            : []
      ),
  },
  {
    id: "firstProductChoice",
    type: "single-select",
    label: () => "Which would you most likely use first?",
    required: true,
    options: (answers) => {
      const q25 = section6[0];
      const base =
        typeof q25.options === "function" ? q25.options(answers) : (q25.options ?? []);
      return base;
    },
  },
  {
    id: "priceRange",
    type: "single-select",
    label: () =>
      "If a digital toolkit saved you hours of research and helped avoid mistakes, what price would feel reasonable?",
    required: true,
    options: [
      "Free only",
      "Under $20",
      "$20-$49",
      "$50-$99",
      "$100-$249",
      "$250+",
    ],
  },
  {
    id: "preferredFormat",
    type: "single-select",
    label: () => "Which format would you prefer?",
    required: true,
    options: [
      "One-time PDF guide/toolkit",
      "Interactive web questionnaire with personalized results",
      "Notion/Google Sheets toolkit",
      "Self-paced mini-course",
      "Monthly membership",
      "One-hour expert review",
      "AI assistant subscription",
    ],
  },
  {
    id: "paymentTrigger",
    type: "open-text",
    label: () => "What would make this worth paying for?",
  },
  {
    id: "purchaseObjection",
    type: "open-text",
    label: () => "What would make you NOT buy this?",
  },
];

const section7: Question[] = [
  {
    id: "earlyAccess",
    type: "single-select",
    label: () => "Would you like to receive early access to the first WellBuilt Spaces tool?",
    required: true,
    options: ["Yes", "Maybe", "No"],
  },
  {
    id: "email",
    type: "email",
    label: () => "What's the best email for early access?",
    required: true,
    showIf: (answers) => answers.earlyAccess === "Yes" || answers.earlyAccess === "Maybe",
  },
  {
    id: "interviewInterest",
    type: "single-select",
    label: () => "Would you be open to a 20-minute conversation about your home challenges?",
    options: ["Yes", "Maybe later", "No"],
  },
  {
    id: "finalNotes",
    type: "open-text",
    label: () =>
      "Anything else you wish existed to help people create healthier, better-designed homes?",
  },
];

export const sections: Section[] = [
  {
    id: "about-your-home",
    step: 1,
    title: "About your home",
    helperText: "A few basics to help us understand your household.",
    questions: section1,
  },
  {
    id: "home-challenges",
    step: 2,
    title: "Your home challenges",
    helperText: "What's frustrating you, and how urgent does it feel?",
    questions: section2,
  },
  {
    id: "healthy-home-awareness",
    step: 3,
    title: "Healthy home awareness",
    helperText: "What healthy home means to you today.",
    questions: section3,
  },
  {
    id: "renovation-decision-making",
    step: 4,
    title: "Renovation and decision-making",
    helperText: "Your upcoming projects and how confident you feel about them.",
    questions: section4,
  },
  {
    id: "ai-digital-tools",
    step: 5,
    title: "AI and digital tools",
    helperText: "How you feel about AI-assisted home guidance.",
    questions: section5,
  },
  {
    id: "product-pricing-validation",
    step: 6,
    title: "Product and pricing validation",
    helperText: "What we should build first, and what it's worth to you.",
    questions: section6,
  },
  {
    id: "early-access",
    step: 7,
    title: "Early access",
    helperText: "Optional — only if you'd like to stay in the loop.",
    questions: section7,
  },
];

export const totalSteps = sections.length;
