import { describe, it, expect } from "vitest";
import { migrateV3ToV4 } from "@/lib/migrate";
import type { Answers } from "@/types/questionnaire";

describe("V3 → V4 migration", () => {
  it("maps fields that have a reliable equivalent", () => {
    const v3: Answers = {
      currentSituation: "I own my home",
      homeType: "Single-family home",
      homeAge: "More than 100 years",
      householdMembers: ["Partner or spouse", "School-age child"],
      decisionInfluencingNeeds: ["Allergy-related concerns", "Mobility or accessibility needs"],
      currentPriorities: ["Better sleep", "Cleaner-feeling indoor air", "Less clutter"],
    };
    const v4 = migrateV3ToV4(v3);
    expect(v4.ownership).toBe("own");
    expect(v4.home_type).toBe("house");
    expect(v4.year_built).toBe("pre1940");
    expect(v4.household).toEqual(["adults", "children"]);
    expect(v4.health_sensitivities).toEqual(["allergies", "mobility"]);
    expect(v4.primary_goals).toEqual(["sleep", "air", "stress"]);
  });

  it("does not invent answers — leaves ambiguous / unmappable fields blank", () => {
    const v4 = migrateV3ToV4({
      homeAge: "21–50 years", // ambiguous build-year band → not mapped
      currentSituation: "I am planning to buy", // no reliable ownership → not mapped
      delayedDecision: "Yes", // no V4 equivalent
    });
    expect(v4.year_built).toBeUndefined();
    expect(v4.ownership).toBeUndefined();
    expect("delayedDecision" in v4).toBe(false);
  });

  it("caps migrated goals at three (V4 limit)", () => {
    const v4 = migrateV3ToV4({
      currentPriorities: [
        "Better sleep",
        "Cleaner-feeling indoor air",
        "Fewer odors, dust, or allergens",
        "Less clutter",
        "Lower energy use",
      ],
    });
    expect((v4.primary_goals as string[]).length).toBe(3);
  });

  it("returns an empty object when nothing maps", () => {
    expect(migrateV3ToV4({ someUnknownField: "x" })).toEqual({});
  });
});
