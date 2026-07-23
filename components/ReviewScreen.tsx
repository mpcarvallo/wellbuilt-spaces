"use client";

import { useState } from "react";
import type { Answers } from "@/types/questionnaire";
import { SECTIONS } from "@/lib/sections";
import { displayAnswer } from "@/lib/answer-labels";
import { isValidEmail } from "@/lib/validate-email";

type ReviewScreenProps = {
  answers: Answers;
  email: string;
  onEmailChange: (email: string) => void;
  onEditSection: (sectionIndex: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
};

export default function ReviewScreen({
  answers,
  email,
  onEmailChange,
  onEditSection,
  onSubmit,
  onBack,
  submitting,
}: ReviewScreenProps) {
  const [touched, setTouched] = useState(false);
  const emailValid = isValidEmail(email);

  const handleSubmit = () => {
    if (!emailValid) {
      setTouched(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-moss">
          Review your answers
        </h2>
        <p className="mt-1 text-base text-muted">
          Take a quick look before we build your Home Snapshot. You can edit anything.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <label htmlFor="review-email" className="text-sm font-medium text-foreground">
          Where should we send your Snapshot? *
        </label>
        <input
          id="review-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150"
        />
        {touched && !emailValid && (
          <p className="mt-1.5 text-sm text-clay">Enter a valid email address.</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {SECTIONS.map((section, index) => (
          <div key={section.module} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg text-moss">{section.module}</h3>
              <button
                type="button"
                data-edit-section={index}
                onClick={() => onEditSection(index)}
                className="text-sm font-semibold text-moss hover:text-moss-dark transition-colors duration-150"
              >
                Edit
              </button>
            </div>
            <dl className="mt-3 flex flex-col gap-2.5">
              {section.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-0.5">
                  <dt className="text-sm text-muted">{q.title}</dt>
                  <dd className="text-sm text-foreground">{displayAnswer(q, answers)}</dd>
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
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-full bg-moss px-8 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Building your Snapshot…" : "Generate my Snapshot"}
        </button>
      </div>
    </div>
  );
}
