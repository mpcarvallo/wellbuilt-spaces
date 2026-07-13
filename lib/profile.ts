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
      members: arr(answers.household),
      sensitivities: arr(answers.health_sensitivities),
    },
    home: {
      type: str(answers.home_type),
      ownership: str(answers.ownership),
      yearBuilt: str(answers.year_built),
      zip: str(answers.zip_code),
      timeHorizon: str(answers.time_horizon),
    },
    capacity: {
      budget: str(answers.budget),
      diyLevel: str(answers.diy_level),
      weeklyTime: str(answers.weekly_time),
    },
    lifestyle: {
      cooking: str(answers.cooking),
    },
    air: {
      stoveType: str(answers.stove_type),
      kitchenExhaust: str(answers.kitchen_exhaust),
      moistureSigns: arr(answers.moisture),
      bathExhaust: str(answers.bath_exhaust),
    },
    water: {
      source: str(answers.drinking_water),
      concerns: arr(answers.water_concerns),
    },
    light: {
      nightFactors: arr(answers.night_light),
      daylight: str(answers.daylight),
    },
    comfort: {
      bedroomSleep: num(answers.bedroom_sleep),
      clutter: str(answers.clutter),
      thermal: str(answers.thermal_comfort),
    },
    materials: {
      fragranceSources: arr(answers.fragrance),
      recentProjects: arr(answers.recent_projects),
      flooring: str(answers.flooring),
    },
    sustainability: {
      existingActions: arr(answers.energy_priorities),
    },
    maintenance: {
      hvacFilter: str(answers.hvac_filter),
      confidence: num(answers.maintenance_confidence),
      safetyChecks: arr(answers.safety_checks),
    },
    startingPoint: {
      firstRoom: str(answers.first_room),
      note: str(answers.open_note),
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
