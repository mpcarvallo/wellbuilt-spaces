"use client";

import type { Answers, Question } from "@/types/questionnaire";
import { SECTIONS } from "@/lib/sections";

type ReviewScreenProps = {
  answers: Answers;
  onEditSection: (sectionIndex: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
};

function displayValue(question: Question, answers: Answers): string {
  const v = answers[question.id];
  if (v === undefined || (Array.isArray(v) && v.length === 0) || v === "") {
    return "—";
  }
  if (question.type === "scale" && typeof v === "number") {
    return `${v} / 5`;
  }
  const labelFor = (val: string) =>
    question.options?.find((o) => o.value === val)?.label ?? val;
  if (Array.isArray(v)) return v.map(labelFor).join(", ");
  if (typeof v === "string") return question.options ? labelFor(v) : v;
  return String(v);
}

export default function ReviewScreen({
  answers,
  onEditSection,
  onSubmit,
  onBack,
  submitting,
}: ReviewScreenProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
          Review your answers
        </h2>
        <p className="mt-1 text-base text-muted">
          Take a quick look before we build your Home Snapshot. You can edit anything.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {SECTIONS.map((section, index) => (
          <div key={section.module} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg text-foreground">{section.module}</h3>
              <button
                type="button"
                data-edit-section={index}
                onClick={() => onEditSection(index)}
                className="text-sm font-medium text-moss hover:text-moss-dark transition-colors duration-150"
              >
                Edit
              </button>
            </div>
            <dl className="mt-3 flex flex-col gap-2.5">
              {section.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-0.5">
                  <dt className="text-sm text-muted">{q.title}</dt>
                  <dd className="text-sm text-foreground">{displayValue(q, answers)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          data-nav="back"
          onClick={onBack}
          className="rounded-full px-5 py-3 text-base font-medium text-muted transition-colors duration-150 hover:text-foreground"
        >
          Back
        </button>
        <button
          type="button"
          data-nav="generate"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-full bg-moss px-8 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Building your Snapshot…" : "Generate my Snapshot"}
        </button>
      </div>
    </div>
  );
}
