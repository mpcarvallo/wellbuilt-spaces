import { Answers, Question, Section } from "./questionnaire-types";

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
