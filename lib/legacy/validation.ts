import { Answers, Question, Section } from "./questionnaire-types";
import { sections } from "./questionnaire-data";

function isAnswered(question: Question, answers: Answers): boolean {
  const value = answers[question.id];
  if (question.type === "multi-select") {
    return Array.isArray(value) && value.length > 0;
  }
  if (question.type === "rating") {
    return typeof value === "number";
  }
  if (question.type === "email") {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  return typeof value === "string" && value.trim().length > 0;
}

export function visibleQuestions(section: Section, answers: Answers): Question[] {
  return section.questions.filter((q) => !q.showIf || q.showIf(answers));
}

export function isQuestionValid(question: Question, answers: Answers): boolean {
  if (!question.required) return true;
  return isAnswered(question, answers);
}

export function isSectionValid(section: Section, answers: Answers): boolean {
  return visibleQuestions(section, answers).every((q) => isQuestionValid(q, answers));
}

export function invalidQuestionIds(section: Section, answers: Answers): string[] {
  return visibleQuestions(section, answers)
    .filter((q) => !isQuestionValid(q, answers))
    .map((q) => q.id);
}

function resolveOptions(question: Question, answers: Answers): string[] | undefined {
  if (typeof question.options === "function") return question.options(answers);
  return question.options;
}

/**
 * Removes answers that are no longer valid after a parent answer changed, so
 * hidden or stale selections are never submitted. Applied on every answer edit
 * and when navigating, so back-navigation edits cascade correctly. Examples:
 * Q7 Yes→No clears Q7A; Q11 Yes→No clears Q12/Q13; Q16 Yes/Maybe→No clears
 * Q17/Q18; changing Q8 or Q17 drops a dynamic Q9/Q18 choice that is gone.
 *
 * Questions are processed in declaration order, mutating a working copy, so a
 * parent's cleared value is already reflected when its dependents are checked.
 */
export function reconcileAnswers(answers: Answers): Answers {
  const next: Answers = { ...answers };

  for (const section of sections) {
    for (const question of section.questions) {
      // 1. Drop answers whose question is now hidden.
      if (question.showIf && !question.showIf(next)) {
        delete next[question.id];
        continue;
      }

      // 2. Drop selections that are no longer among the (possibly dynamic) options.
      const options = resolveOptions(question, next);
      if (!options) continue;
      const current = next[question.id];

      if (question.type === "single-select") {
        if (typeof current === "string" && !options.includes(current)) {
          delete next[question.id];
        }
      } else if (question.type === "multi-select" && Array.isArray(current)) {
        const filtered = current.filter((o) => options.includes(o));
        if (filtered.length === 0) {
          delete next[question.id];
        } else if (filtered.length !== current.length) {
          next[question.id] = filtered;
        }
      }
    }
  }

  return next;
}
