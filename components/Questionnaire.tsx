"use client";

import { useEffect, useRef, useState } from "react";
import { sections, totalSteps } from "@/lib/questionnaire-data";
import { Answers, WellBuiltValidationResponseV3 } from "@/lib/questionnaire-types";
import { buildResponse } from "@/lib/build-response";
import {
  invalidQuestionIds,
  isSectionValid,
  reconcileAnswers,
  visibleQuestions,
} from "@/lib/validation";
import WelcomeScreen from "./WelcomeScreen";
import ThankYouScreen from "./ThankYouScreen";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";

type Phase = "welcome" | "questions" | "thank-you";

const STORAGE_KEY = "wellbuilt-validation-v3";

type PersistedState = {
  version: typeof STORAGE_KEY;
  phase: Phase;
  sectionIndex: number;
  answers: Answers;
  responseId: string;
  startedAt: string;
};

function newResponseId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `resp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function Questionnaire() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [invalidIds, setInvalidIds] = useState<string[]>([]);
  const [responseId, setResponseId] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [finalResponse, setFinalResponse] = useState<WellBuiltValidationResponseV3 | null>(null);

  // Prevents saving to storage before we've attempted to restore from it.
  const hydrated = useRef(false);
  // Guards against a duplicate final submission (e.g. double-click on Submit).
  const submitted = useRef(false);

  // Restore in-progress state on mount (QA Path E: refresh mid-way).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PersistedState;
        if (saved && saved.version === STORAGE_KEY) {
          setPhase(saved.phase);
          setSectionIndex(saved.sectionIndex ?? 0);
          setAnswers(saved.answers ?? {});
          setResponseId(saved.responseId || newResponseId());
          setStartedAt(saved.startedAt || new Date().toISOString());
          if (saved.phase === "thank-you") submitted.current = true;
        }
      }
    } catch {
      // Corrupt or unavailable storage — start fresh.
    }
    hydrated.current = true;
  }, []);

  // Persist progress whenever it changes (only after the restore attempt).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (phase === "welcome") {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const toSave: PersistedState = {
        version: STORAGE_KEY,
        phase,
        sectionIndex,
        answers,
        responseId,
        startedAt,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage unavailable — progress simply won't persist.
    }
  }, [phase, sectionIndex, answers, responseId, startedAt]);

  const currentSection = sections[sectionIndex];

  const startQuestionnaire = () => {
    if (!responseId) setResponseId(newResponseId());
    if (!startedAt) setStartedAt(new Date().toISOString());
    setPhase("questions");
  };

  const handleAnswer = (id: string, value: string | string[] | number) => {
    // Clear any dependent answers invalidated by this change (e.g. changing a
    // parent select removes stale hidden or dynamic child answers).
    setAnswers((prev) => reconcileAnswers({ ...prev, [id]: value }));
    setInvalidIds((prev) => prev.filter((qId) => qId !== id));
  };

  const submit = (finalAnswers: Answers) => {
    if (submitted.current) return;
    submitted.current = true;
    const response = buildResponse(finalAnswers, {
      responseId: responseId || newResponseId(),
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      completionStatus: "completed",
    });
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
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const handleBack = () => {
    setInvalidIds([]);
    if (sectionIndex === 0) {
      setPhase("welcome");
      return;
    }
    setSectionIndex((i) => i - 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const handleEmailFromThankYou = (email: string) => {
    const merged = reconcileAnswers({
      ...answers,
      email,
      earlyAccessInterest: answers.earlyAccessInterest || "Yes",
    });
    setAnswers(merged);
    const response = buildResponse(merged, {
      responseId: responseId || newResponseId(),
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      completionStatus: "completed",
    });
    // TODO: replace this console log with a real submission target.
    console.log("WellBuilt Spaces late email capture:", response);
    setFinalResponse(response);
  };

  if (phase === "welcome") {
    return <WelcomeScreen onStart={startQuestionnaire} />;
  }

  if (phase === "thank-you") {
    const wantsEarlyAccess =
      finalResponse?.research.earlyAccessInterest !== "Yes" &&
      finalResponse?.research.earlyAccessInterest !== "Maybe";
    return (
      <ThankYouScreen showEmailCta={wantsEarlyAccess} onEmailSubmit={handleEmailFromThankYou} />
    );
  }

  const questions = visibleQuestions(currentSection, answers);
  const isLastSection = sectionIndex === sections.length - 1;

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar
        step={currentSection.step}
        totalSteps={totalSteps}
        label={currentSection.progressLabel}
      />

      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground">{currentSection.title}</h2>
        <p className="mt-1 text-base text-muted">{currentSection.helperText}</p>
      </div>

      {currentSection.conceptCard && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col gap-3">
          {currentSection.conceptCard.eyebrow && (
            <span className="text-sm font-medium tracking-wide text-moss uppercase">
              {currentSection.conceptCard.eyebrow}
            </span>
          )}
          {currentSection.conceptCard.body.map((paragraph, i) => (
            <p key={i} className="text-base text-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

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
