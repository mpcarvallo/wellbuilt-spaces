"use client";

import { useState } from "react";
import { sections, totalSteps } from "@/lib/questionnaire-data";
import { Answers, QuestionnaireResponse } from "@/lib/questionnaire-types";
import { buildResponse } from "@/lib/build-response";
import { invalidQuestionIds, isSectionValid, visibleQuestions } from "@/lib/validation";
import WelcomeScreen from "./WelcomeScreen";
import ThankYouScreen from "./ThankYouScreen";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";

type Phase = "welcome" | "questions" | "thank-you";

export default function Questionnaire() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [invalidIds, setInvalidIds] = useState<string[]>([]);
  const [finalResponse, setFinalResponse] = useState<QuestionnaireResponse | null>(null);

  const currentSection = sections[sectionIndex];

  const handleAnswer = (id: string, value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setInvalidIds((prev) => prev.filter((qId) => qId !== id));
  };

  const submit = (finalAnswers: Answers) => {
    const response = buildResponse(finalAnswers);
    // TODO: replace this console log with a real submission —
    // e.g. POST to Supabase, Airtable, Google Sheets, or Formspree.
    console.log("WellBuilt Spaces questionnaire response:", response);
    setFinalResponse(response);
    setPhase("thank-you");
  };

  const handleNext = () => {
    if (!isSectionValid(currentSection, answers)) {
      setInvalidIds(invalidQuestionIds(currentSection, answers));
      return;
    }
    setInvalidIds([]);
    if (sectionIndex === sections.length - 1) {
      submit(answers);
      return;
    }
    setSectionIndex((i) => i + 1);
  };

  const handleBack = () => {
    setInvalidIds([]);
    if (sectionIndex === 0) {
      setPhase("welcome");
      return;
    }
    setSectionIndex((i) => i - 1);
  };

  const handleEmailFromThankYou = (email: string) => {
    const merged = { ...answers, email, earlyAccess: answers.earlyAccess || "Yes" };
    setAnswers(merged);
    const response = buildResponse(merged);
    // TODO: replace this console log with a real submission target.
    console.log("WellBuilt Spaces late email capture:", response);
    setFinalResponse(response);
  };

  if (phase === "welcome") {
    return <WelcomeScreen onStart={() => setPhase("questions")} />;
  }

  if (phase === "thank-you") {
    const wantsEarlyAccess =
      finalResponse?.earlyAccess !== "Yes" && finalResponse?.earlyAccess !== "Maybe";
    return (
      <ThankYouScreen showEmailCta={wantsEarlyAccess} onEmailSubmit={handleEmailFromThankYou} />
    );
  }

  const questions = visibleQuestions(currentSection, answers);
  const isLastSection = sectionIndex === sections.length - 1;

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar step={currentSection.step} totalSteps={totalSteps} label={currentSection.title} />

      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground">{currentSection.title}</h2>
        <p className="mt-1 text-base text-muted">{currentSection.helperText}</p>
      </div>

      <div className="flex flex-col gap-8">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answers={answers}
            onAnswer={handleAnswer}
            showError={invalidIds.includes(question.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          data-nav="back"
          onClick={handleBack}
          className="rounded-full px-5 py-3 text-base font-medium text-muted transition-colors duration-150 hover:text-foreground"
        >
          Back
        </button>
        <button
          type="button"
          data-nav="next"
          onClick={handleNext}
          className="rounded-full bg-moss px-8 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
        >
          {isLastSection ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
