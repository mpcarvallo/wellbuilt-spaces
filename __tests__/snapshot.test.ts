import { describe, it, expect } from "vitest";
import { selectRecommendations } from "@/lib/recommendations";
import { generateSnapshot } from "@/lib/snapshot";
import type { Answers } from "@/types/questionnaire";
import type { CostBand, Effort } from "@/types/home-profile";

const EFFORTS: Effort[] = ["quick", "afternoon", "weekend", "professional"];
const COSTS: CostBand[] = ["free", "under_100", "100_500", "500_2000", "over_2000"];

const PATH_A: Answers = {
  primary_goals: ["air", "sleep", "allergies"],
  household: ["adults", "young_children"],
  home_type: "house",
  ownership: "own",
  year_built: "1940_1977",
  budget: "100_500",
  diy_level: "medium",
  cooking: "daily",
  stove_type: "gas",
  kitchen_exhaust: "none",
  moisture: ["musty", "leaks"],
  bath_exhaust: "none",
  hvac_filter: "old",
  bedroom_sleep: 2,
  night_light: ["outdoor_light", "noise"],
  safety_checks: ["none"],
  maintenance_confidence: 2,
  first_room: "bedroom",
};

describe("recommendation engine", () => {
  it("always returns exactly three prioritized actions", () => {
    expect(selectRecommendations(PATH_A).topActions.length).toBe(3);
    expect(selectRecommendations({}).topActions.length).toBe(3); // empty answers still work
    expect(selectRecommendations({ home_type: "condo" }).topActions.length).toBe(3);
  });

  it("keeps a triggered safety action in the top three", () => {
    const ids = selectRecommendations(PATH_A).topActions.map((a) => a.id);
    expect(ids).toContain("safety-alarms");
  });

  it("guarantees at least one action fits the stated budget", () => {
    const order = COSTS;
    const budget = order.indexOf("100_500");
    const top = selectRecommendations(PATH_A).topActions;
    expect(top.some((a) => order.indexOf(a.costBand) <= budget)).toBe(true);
  });

  it("adds a landlord note for renters on professional actions", () => {
    const renter: Answers = { ...PATH_A, ownership: "rent" };
    const moisture = selectRecommendations(renter).topActions.find((a) => a.id === "moisture-investigate");
    if (moisture) {
      expect(moisture.professionalNote?.toLowerCase()).toContain("landlord");
    }
  });
});

describe("snapshot output (matches API contract)", () => {
  it("has the versioned shape with valid enums and no score fields", () => {
    const snap = generateSnapshot(PATH_A);
    expect(snap.schemaVersion).toBe(4);
    expect(snap.generatedBy).toBe("rules");
    expect(snap.topActions.length).toBe(3);
    for (const a of snap.topActions) {
      expect(EFFORTS).toContain(a.effort);
      expect(COSTS).toContain(a.costBand);
      expect(["high", "medium", "low"]).toContain(a.confidence);
      expect(a.categories.length).toBeGreaterThan(0);
    }
    expect(snap.indicators.length).toBe(6);
    expect(snap.disclaimer.toLowerCase()).toContain("not");
    // no diagnostic / health-score language leaks into the payload
    expect(JSON.stringify(snap)).not.toMatch(/healthy home score|we detected|your air is unsafe|certified healthy/i);
  });

  it("uses transparent, non-diagnostic language", () => {
    const snap = generateSnapshot(PATH_A);
    expect(snap.intro.toLowerCase()).toContain("based on your answers");
  });
});
