import { questionnaireV4 } from "@/data/questionnaire-v4";
import type { Answers } from "@/types/questionnaire";
import {
  SCHEMA_VERSION,
  type HomeProfileGroups,
  type HomeProfileV4,
  type ProjectProgress,
  type Snapshot,
} from "@/types/home-profile";

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined;
const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
const num = (v: unknown): number | undefined => (typeof v === "number" ? v : undefined);

/** Question ids that are required (V4 has no conditional branching, so all are always visible). */
export const REQUIRED_IDS: string[] = questionnaireV4
  .filter((q) => q.required)
  .map((q) => q.id);

/** Percentage of required questions that have a usable answer. */
export function completionPercent(answers: Answers): number {
  if (REQUIRED_IDS.length === 0) return 100;
  const answered = REQUIRED_IDS.filter((id) => isAnswered(answers[id]));
  return Math.round((answered.length / REQUIRED_IDS.length) * 100);
}

export function isAnswered(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return true;
  return false;
}

/** Builds the typed group projection from raw answers. */
export function deriveGroups(answers: Answers): HomeProfileGroups {
  return {
    goals: arr(answers.primary_goals),
    household: {
      members: arr(answers.household_composition),
      sensitivities: arr(answers.household_considerations),
    },
    home: {
      type: str(answers.home_type),
      ownership: str(answers.own_or_rent),
      yearBuilt: str(answers.home_age),
      zip: str(answers.zip_code),
      timeHorizon: str(answers.home_plans),
    },
    capacity: {
      budget: str(answers.budget),
      diyLevel: str(answers.diy_comfort),
      weeklyTime: str(answers.weekly_time),
    },
    lifestyle: {
      cooking: str(answers.cook_frequency),
    },
    air: {
      stoveType: str(answers.cooktop_type),
      kitchenExhaust: str(answers.kitchen_exhaust),
      moistureSigns: arr(answers.moisture_signs),
    },
    light: {
      nightFactors: arr(answers.bedroom_disruptors),
      daylight: str(answers.daylight),
    },
    comfort: {
      bedroomSleep: num(answers.bedroom_restfulness),
      clutter: str(answers.clutter_frequency),
      thermal: str(answers.room_temperature),
      noise: str(answers.acoustics),
    },
    materials: {
      fragranceSources: arr(answers.scented_products),
      recentProjects: arr(answers.recent_changes),
    },
    maintenance: {
      hvacFilter: str(answers.hvac_filter),
    },
    startingPoint: {
      firstRoom: str(answers.priority_area),
      note: str(answers.open_notes),
    },
  };
}

export type HomeProfileMeta = {
  profileId: string;
  createdAt: string;
  updatedAt?: string;
  completionStatus?: "in_progress" | "completed";
  snapshot?: Snapshot;
  photos?: HomeProfileV4["photos"];
  progress?: ProjectProgress[];
};

/** Assembles a versioned Home Profile from answers. */
export function buildHomeProfile(answers: Answers, meta: HomeProfileMeta): HomeProfileV4 {
  const percent = completionPercent(answers);
  return {
    schemaVersion: SCHEMA_VERSION,
    profileId: meta.profileId,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt ?? new Date().toISOString(),
    completionStatus: meta.completionStatus ?? (percent >= 100 ? "completed" : "in_progress"),
    completionPercent: percent,
    answers,
    profile: deriveGroups(answers),
    snapshot: meta.snapshot,
    photos: meta.photos ?? [],
    progress: meta.progress ?? [],
  };
}
