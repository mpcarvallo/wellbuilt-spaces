import { describe, it, expect } from "vitest";
import { labelForValue, labelsForValues } from "@/lib/answer-labels";

describe("labelForValue", () => {
  it("maps a known raw value to its display label", () => {
    expect(labelForValue("own_or_rent", "own")).toBe("Own");
    expect(labelForValue("home_type", "apartment")).toBe("Apartment");
  });

  it("falls back to the raw value for an unknown question or value", () => {
    expect(labelForValue("not_a_real_question", "whatever")).toBe("whatever");
    expect(labelForValue("own_or_rent", "not_a_real_option")).toBe("not_a_real_option");
  });
});

describe("labelsForValues", () => {
  it("maps each value in an array", () => {
    expect(labelsForValues("primary_goals", ["sleep", "air"])).toEqual([
      "Better sleep",
      "Cleaner-feeling air",
    ]);
  });

  it("returns an empty array for an empty input", () => {
    expect(labelsForValues("primary_goals", [])).toEqual([]);
  });
});
