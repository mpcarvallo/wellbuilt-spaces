/**
 * WellBuilt Home Profile — Version 4.
 *
 * The Home Profile is the persistent, versioned representation of a user's
 * questionnaire responses plus anything derived from them (a generated
 * Snapshot, project progress, future photo references).
 *
 * `answers` (keyed by question id) is the source of truth; `profile` is a
 * typed projection built from it (see lib/profile.ts). Nothing here stores a
 * health diagnosis, a "healthy home score," or any measured building value.
 */

import type { Answers, Pillar } from "./questionnaire";

export const SCHEMA_VERSION = 4 as const;
export type SchemaVersion = typeof SCHEMA_VERSION;

/** Cost bands mirror the questionnaire's budget scale. */
export type CostBand = "free" | "under_100" | "100_500" | "500_2000" | "over_2000";

/** Rough effort to complete an action. */
export type Effort = "quick" | "afternoon" | "weekend" | "professional";

/** How confident the guidance is, given only self-reported answers. */
export type Confidence = "high" | "medium" | "low";

/** A single prioritized action in the Snapshot. */
export type SnapshotAction = {
  id: string;
  title: string;
  /** Why this matters, in transparent "based on your answers" language. */
  why: string;
  effort: Effort;
  costBand: CostBand;
  diyFriendly: boolean;
  /** Home categories (pillars) the action connects to. */
  categories: Pillar[];
  confidence: Confidence;
  /** When a condition cannot be confirmed remotely, how a professional can help. */
  professionalNote?: string;
  /** Concrete steps (shown for the expanded/first action; full set is a paid experiment). */
  steps?: string[];
};

/**
 * Report-level categories shown to the user. These intentionally differ from
 * the questionnaire's raw `Pillar` tags: moisture folds into "Water and
 * moisture," and light + comfort combine into "Light and comfort."
 */
export type ReportCategory =
  | "air"
  | "water"
  | "light_comfort"
  | "materials"
  | "sustainability"
  | "maintenance";

/** Profile-based indicator for a report category. NOT a measured score. */
export type IndicatorLevel = "attention" | "developing" | "strong";

export type CategoryIndicator = {
  category: ReportCategory;
  label: string;
  level: IndicatorLevel;
  /** 0–100 profile-based value; framed as an indicator from answers, not a measurement. */
  value: number;
  note: string;
};

/** The immediate Home Snapshot shown after the questionnaire. */
export type Snapshot = {
  schemaVersion: SchemaVersion;
  /** Whether the AI endpoint or the deterministic rules produced this. */
  generatedBy: "rules" | "ai";
  rulesVersion: string;
  modelVersion?: string;
  /** One-sentence personalized interpretation. */
  intro: string;
  /** Exactly three prioritized actions. */
  topActions: SnapshotAction[];
  /** "Later, not now" items. */
  later: { title: string; why?: string }[];
  /** Questions that would improve confidence if answered. */
  missingInfo: string[];
  /** Profile-based category indicators. */
  indicators: CategoryIndicator[];
  disclaimer: string;
};

/** Typed projection of the answers, grouped for storage and downstream logic. */
export type HomeProfileGroups = {
  goals: string[];
  household: {
    members: string[];
    sensitivities: string[];
  };
  home: {
    type?: string;
    ownership?: string;
    yearBuilt?: string;
    zip?: string;
    timeHorizon?: string;
  };
  capacity: {
    budget?: string;
    diyLevel?: string;
    weeklyTime?: string;
  };
  lifestyle: {
    cooking?: string;
  };
  air: {
    stoveType?: string;
    kitchenExhaust?: string;
    moistureSigns: string[];
    bathExhaust?: string;
  };
  water: {
    source?: string;
    concerns: string[];
  };
  light: {
    nightFactors: string[];
    daylight?: string;
  };
  comfort: {
    bedroomSleep?: number;
    clutter?: string;
    thermal?: string;
  };
  materials: {
    fragranceSources: string[];
    recentProjects: string[];
    flooring?: string;
  };
  sustainability: {
    existingActions: string[];
  };
  maintenance: {
    hvacFilter?: string;
    confidence?: number;
    safetyChecks: string[];
  };
  startingPoint: {
    firstRoom?: string;
    note?: string;
  };
};

/** Reference to a future user-uploaded photo (photo analysis is not built in V4). */
export type PhotoRef = {
  id: string;
  room?: string;
  uploadedAt: string;
  note?: string;
};

/** Tracks a user acting on a recommendation over time. */
export type ProjectProgress = {
  actionId: string;
  status: "planned" | "in_progress" | "done" | "skipped";
  updatedAt: string;
  note?: string;
};

/** The full versioned Home Profile record. */
export type HomeProfileV4 = {
  schemaVersion: SchemaVersion;
  profileId: string;
  createdAt: string;
  updatedAt: string;
  completionStatus: "in_progress" | "completed";
  /** 0–100, based on required questions answered. */
  completionPercent: number;
  /** Raw answers by question id — source of truth. */
  answers: Answers;
  /** Typed projection of `answers`. */
  profile: HomeProfileGroups;
  /** Optional generated Snapshot. */
  snapshot?: Snapshot;
  /** Future photo uploads (empty in V4). */
  photos: PhotoRef[];
  /** Progress over time on recommended actions. */
  progress: ProjectProgress[];
};
