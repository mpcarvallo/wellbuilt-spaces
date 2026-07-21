import { describe, it, expect } from "vitest";
import { questionnaireV4 } from "@/data/questionnaire-v4";
import { SECTIONS, TOTAL_STEPS, isSectionValid, invalidQuestionIds } from "@/lib/sections";
import { REQUIRED_IDS, completionPercent } from "@/lib/profile";
import type { Answers } from "@/types/questionnaire";

describe("questionnaire structure", () => {
  it("is data-driven with the full question set", () => {
    expect(questionnaireV4.length).toBe(26);
  });

  it("groups into section-per-screen modules preserving order", () => {
    expect(SECTIONS.length).toBe(TOTAL_STEPS);
    expect(SECTIONS[0].module).toBe("Your goals");
    // consecutive same-module questions are merged
    const home = SECTIONS.find((s) => s.module === "Your home");
    expect(home?.questions.map((q) => q.id)).toEqual(["home_type", "home_age", "zip_code"]);
    const plans = SECTIONS.find((s) => s.module === "Your plans");
    expect(plans?.questions.map((q) => q.id)).toEqual(["own_or_rent", "home_plans"]);
  });

  it("marks the expected required questions", () => {
    expect(REQUIRED_IDS).toEqual(
      expect.arrayContaining([
        "primary_goals",
        "household_composition",
        "zip_code",
        "budget",
        "moisture_signs",
        "bedroom_restfulness",
        "priority_area",
      ])
    );
    expect(REQUIRED_IDS.length).toBe(7);
  });
});

describe("required-answer validation", () => {
  it("blocks a section until required questions are answered", () => {
    const goals = SECTIONS[0];
    expect(isSectionValid(goals, {})).toBe(false);
    expect(invalidQuestionIds(goals, {})).toContain("primary_goals");
    expect(isSectionValid(goals, { primary_goals: ["sleep"] })).toBe(true);
  });

  it("computes completion percent from required answers", () => {
    expect(completionPercent({})).toBe(0);
    const full: Answers = {};
    for (const id of REQUIRED_IDS) {
      const q = questionnaireV4.find((qq) => qq.id === id)!;
      full[id] = q.type === "multi" ? ["x"] : q.type === "scale" ? 3 : "x";
    }
    expect(completionPercent(full)).toBe(100);
  });
});

describe("selection limits (multi-select)", () => {
  it("caps primary goals at three", () => {
    const goals = questionnaireV4.find((q) => q.id === "primary_goals")!;
    expect(goals.maxSelections).toBe(3);
  });

  it("declares the other documented multi-select limits", () => {
    // Only primary_goals has a hard limit; the rest are unbounded by design.
    const limited = questionnaireV4.filter((q) => q.maxSelections !== undefined);
    expect(limited.map((q) => q.id)).toEqual(["primary_goals"]);
  });
});
