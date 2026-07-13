import { Answers, Question } from "@/lib/questionnaire-types";
import OptionButton from "./OptionButton";
import CheckboxChip from "./CheckboxChip";
import RatingScale from "./RatingScale";
import TextAreaQuestion from "./TextAreaQuestion";
import EmailCapture from "./EmailCapture";

type QuestionCardProps = {
  question: Question;
  answers: Answers;
  onAnswer: (id: string, value: string | string[] | number) => void;
  showError: boolean;
};

export default function QuestionCard({ question, answers, onAnswer, showError }: QuestionCardProps) {
  const value = answers[question.id];
  const helperText = question.helperText?.(answers);
  const options =
    typeof question.options === "function" ? question.options(answers) : question.options;

  const exclusive = question.exclusiveOptions ?? [];

  const toggleMulti = (option: string) => {
    const current = Array.isArray(value) ? value : [];
    // Deselecting is always allowed.
    if (current.includes(option)) {
      onAnswer(
        question.id,
        current.filter((o) => o !== option)
      );
      return;
    }
    // Selecting an exclusive option (e.g. "None of these") clears all others.
    if (exclusive.includes(option)) {
      onAnswer(question.id, [option]);
      return;
    }
    // Selecting a normal option clears any exclusive options first.
    const base = current.filter((o) => !exclusive.includes(o));
    if (question.maxSelect && base.length >= question.maxSelect) return;
    onAnswer(question.id, [...base, option]);
  };

  return (
    <div className="space-y-3" data-question={question.id}>
      <div>
        <label
          htmlFor={question.id}
          className="block font-serif text-lg sm:text-xl text-foreground"
        >
          {question.label(answers)}
          {question.required && <span className="text-clay"> *</span>}
        </label>
        {helperText && <p className="mt-1 text-sm text-muted">{helperText}</p>}
      </div>

      {question.type === "single-select" && options && (
        <div role="radiogroup" aria-label={question.label(answers)} className="grid gap-2.5">
          {options.map((option) => (
            <OptionButton
              key={option}
              label={option}
              selected={value === option}
              onClick={() => onAnswer(question.id, option)}
            />
          ))}
        </div>
      )}

      {question.type === "multi-select" && options && (
        <div role="group" aria-label={question.label(answers)} className="flex flex-wrap gap-2">
          {options.map((option) => {
            const current = Array.isArray(value) ? value : [];
            const selected = current.includes(option);
            // Exclusive options (e.g. "None of these") are never disabled by the
            // selection limit — they replace the current selection when clicked.
            const nonExclusiveCount = current.filter((o) => !exclusive.includes(o)).length;
            const disabled =
              !selected &&
              !exclusive.includes(option) &&
              !!question.maxSelect &&
              nonExclusiveCount >= question.maxSelect;
            return (
              <CheckboxChip
                key={option}
                label={option}
                selected={selected}
                disabled={disabled}
                onClick={() => toggleMulti(option)}
              />
            );
          })}
        </div>
      )}

      {question.type === "rating" && (
        <RatingScale
          value={typeof value === "number" ? value : undefined}
          onChange={(n) => onAnswer(question.id, n)}
          minLabel={question.ratingLabels?.min}
          maxLabel={question.ratingLabels?.max}
        />
      )}

      {question.type === "open-text" && (
        <TextAreaQuestion
          id={question.id}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onAnswer(question.id, v)}
          placeholder={question.placeholder}
        />
      )}

      {question.type === "email" && (
        <EmailCapture
          id={question.id}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onAnswer(question.id, v)}
        />
      )}

      {showError && (
        <p className="text-sm text-clay">Please answer this question to continue.</p>
      )}
    </div>
  );
}
