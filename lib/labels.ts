import type { Pillar } from "@/types/questionnaire";
import type { Confidence, CostBand, Effort } from "@/types/home-profile";

export const COST_LABELS: Record<CostBand, string> = {
  free: "Free",
  under_100: "Under $100",
  "100_500": "$100–$500",
  "500_2000": "$500–$2,000",
  over_2000: "Over $2,000",
};

export const EFFORT_LABELS: Record<Effort, string> = {
  quick: "Quick (under an hour)",
  afternoon: "An afternoon",
  weekend: "A weekend",
  professional: "Professional project",
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  high: "High confidence",
  medium: "Moderate confidence",
  low: "Worth confirming",
};

export const PILLAR_LABELS: Record<Pillar, string> = {
  lifestyle: "Daily life",
  air: "Air",
  water: "Water & moisture",
  light: "Light",
  comfort: "Comfort",
  materials: "Materials",
  sustainability: "Sustainability",
  maintenance: "Maintenance",
};
