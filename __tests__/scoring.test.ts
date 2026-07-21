import { describe, it, expect } from "vitest";
import { computeIndicators, REPORT_CATEGORIES, categoryValue } from "@/lib/scoring";
import type { Answers } from "@/types/questionnaire";

describe("profile-based scoring", () => {
  it("produces one indicator per report category", () => {
    const indicators = computeIndicators({});
    expect(indicators.length).toBe(REPORT_CATEGORIES.length);
    expect(indicators.map((i) => i.category).sort()).toEqual([...REPORT_CATEGORIES].sort());
  });

  it("keeps every indicator within 0–100", () => {
    const answers: Answers = {
      cooktop_type: "gas",
      kitchen_exhaust: "none",
      moisture_signs: ["musty", "leaks", "staining"],
    };
    for (const ind of computeIndicators(answers)) {
      expect(ind.value).toBeGreaterThanOrEqual(0);
      expect(ind.value).toBeLessThanOrEqual(100);
    }
  });

  it("lowers a category value when risky answers are given", () => {
    const clean: Answers = { cooktop_type: "induction", kitchen_exhaust: "outside" };
    const risky: Answers = { cooktop_type: "gas", kitchen_exhaust: "none" };
    expect(categoryValue("air", risky)).toBeLessThan(categoryValue("air", clean));
  });

  it("marks a risk-heavy category as 'attention'", () => {
    const risky: Answers = { cooktop_type: "gas", kitchen_exhaust: "none" };
    const air = computeIndicators(risky).find((i) => i.category === "air")!;
    expect(air.level).toBe("attention");
  });

  it("never emits a numeric health claim in indicator notes", () => {
    for (const ind of computeIndicators({ clutter_frequency: "daily" })) {
      expect(ind.note).not.toMatch(/\d+\s*%/); // no "20%"-style claims
      expect(ind.note.toLowerCase()).not.toContain("diagnos");
    }
  });
});
