import type { Answers, Question } from "@/types/questionnaire";
import { EXCLUSIVE_VALUES, SCALE_LABELS } from "@/lib/sections";
import OptionButton from "./OptionButton";
import CheckboxChip from "./CheckboxChip";
import RatingScale from "./RatingScale";
import TextAreaQuestion from "./TextAreaQuestion";

type QuestionCardProps = {
  question: Question;
  answers: Answers;
  onAnswer: (id: string, value: string | string[] | number) => void;
  showError: boolean;
};

export default function QuestionCard({ question, answers, onAnswer, showError }: QuestionCardProps) {
  const value = answers[question.id];
  const options = question.options ?? [];

  const toggleMulti = (optionValue: string) => {
    const current = Array.isArray(value) ? value : [];
    // Deselect.
    if (current.includes(optionValue)) {
      onAnswer(
        question.id,
        current.filter((o) => o !== optionValue)
      );
      return;
    }
    // Selecting an exclusive option (e.g. "None") clears everything else.
    if (EXCLUSIVE_VALUES.has(optionValue)) {
      onAnswer(question.id, [optionValue]);
      return;
    }
    // Selecting a normal option clears any exclusive option first.
    const base = current.filter((o) => !EXCLUSIVE_VALUES.has(o));
    if (question.maxSelections && base.length >= question.maxSelections) return;
    onAnswer(question.id, [...base, optionValue]);
  };

  const scaleLabels = SCALE_LABELS[question.id];
  // zip_code is a short single-line entry; other text questions use a textarea.
  const isShortText = question.id === "zip_code";

  return (
    <div className="space-y-3" data-question={question.id}>
      <div>
        <label htmlFor={question.id} className="block font-serif text-lg sm:text-xl text-foreground">
          {question.title}
          {question.required && <span className="text-clay"> *</span>}
        </label>
        {question.helper && <p className="mt-1 text-sm text-muted">{question.helper}</p>}
      </div>

      {question.type === "single" && options.length > 0 && (
        <div role="radiogroup" aria-label={question.title} className="grid gap-2.5">
          {options.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={value === opt.value}
              onClick={() => onAnswer(question.id, opt.value)}
            />
          ))}
        </div>
      )}

      {question.type === "multi" && options.length > 0 && (
        <div role="group" aria-label={question.title} className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const current = Array.isArray(value) ? value : [];
            const selected = current.includes(opt.value);
            const nonExclusiveCount = current.filter((o) => !EXCLUSIVE_VALUES.has(o)).length;
            const disabled =
              !selected &&
              !EXCLUSIVE_VALUES.has(opt.value) &&
              !!question.maxSelections &&
              nonExclusiveCount >= question.maxSelections;
            return (
              <CheckboxChip
                key={opt.value}
                label={opt.label}
                selected={selected}
                disabled={disabled}
                onClick={() => toggleMulti(opt.value)}
              />
            );
          })}
        </div>
      )}

      {question.type === "scale" && (
        <RatingScale
          value={typeof value === "number" ? value : undefined}
          onChange={(n) => onAnswer(question.id, n)}
          minLabel={scaleLabels?.min}
          maxLabel={scaleLabels?.max}
        />
      )}

      {question.type === "text" && isShortText && (
        <input
          id={question.id}
          type="text"
          inputMode="numeric"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="e.g. 94110"
          className="w-full max-w-xs rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150"
        />
      )}

      {question.type === "text" && !isShortText && (
        <TextAreaQuestion
          id={question.id}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onAnswer(question.id, v)}
        />
      )}

      {showError && <p className="text-sm text-clay">Please answer this question to continue.</p>}
    </div>
  );
}
