"use client";

import { useEffect, useRef, useState } from "react";
import type { Answers } from "@/types/questionnaire";
import type { Snapshot as SnapshotType } from "@/types/home-profile";
import { SCHEMA_VERSION } from "@/types/home-profile";
import { SECTIONS, TOTAL_STEPS, invalidQuestionIds, isSectionValid } from "@/lib/sections";
import { completionPercent } from "@/lib/profile";
import { generateSnapshot } from "@/lib/snapshot";
import { loadLegacyAnswers } from "@/lib/migrate";
import { track } from "@/lib/analytics";
import WelcomeScreen from "./WelcomeScreen";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import ReviewScreen from "./ReviewScreen";
import Snapshot from "./Snapshot";
import SectionIcon from "./SectionIcon";

type Phase = "welcome" | "questions" | "review" | "snapshot";

const STORAGE_KEY = "wellbuilt-home-profile-v4";

type PersistedState = {
  schemaVersion: typeof SCHEMA_VERSION;
  phase: Phase;
  sectionIndex: number;
  answers: Answers;
  profileId: string;
  startedAt: string;
  email?: string;
  snapshot?: SnapshotType;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `hp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function Questionnaire() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [invalidIds, setInvalidIds] = useState<string[]>([]);
  const [profileId, setProfileId] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [snapshot, setSnapshot] = useState<SnapshotType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hydrated = useRef(false);
  const answeredOnce = useRef<Set<string>>(new Set());
  const completedRef = useRef(false);

  const currentSection = SECTIONS[sectionIndex];

  // Restore in-progress state, or migrate a previous-version saved response.
  // This is a one-time hydrate-from-localStorage on mount (an external system),
  // which is exactly what effects are for — the setState calls are intentional.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PersistedState;
        if (saved && saved.schemaVersion === SCHEMA_VERSION) {
          // A finished session (they already got their Snapshot) isn't "in
          // progress" — don't auto-resume straight to it on a later visit.
          // Only questions/review (unfinished work) are worth restoring.
          if (saved.phase === "snapshot") {
            window.localStorage.removeItem(STORAGE_KEY);
            hydrated.current = true;
            return;
          }
          setPhase(saved.phase);
          setSectionIndex(saved.sectionIndex ?? 0);
          setAnswers(saved.answers ?? {});
          setProfileId(saved.profileId || newId());
          setStartedAt(saved.startedAt || new Date().toISOString());
          setEmail(saved.email ?? "");
          hydrated.current = true;
          return;
        }
      }
      // No V4 state — try mapping an older saved questionnaire.
      const legacy = loadLegacyAnswers();
      if (legacy && Object.keys(legacy.answers).length > 0) {
        setAnswers(legacy.answers);
        setProfileId(newId());
        setStartedAt(new Date().toISOString());
        // Stay on welcome; the user resumes into a pre-filled V4 questionnaire.
      }
    } catch {
      // Corrupt/unavailable storage — start fresh.
    }
    hydrated.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist progress.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (phase === "welcome" && Object.keys(answers).length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const toSave: PersistedState = {
        schemaVersion: SCHEMA_VERSION,
        phase,
        sectionIndex,
        answers,
        profileId,
        startedAt,
        email: email || undefined,
        snapshot: snapshot ?? undefined,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      /* storage unavailable */
    }
  }, [phase, sectionIndex, answers, profileId, startedAt, email, snapshot]);

  // Best-effort abandonment tracking.
  useEffect(() => {
    const onLeave = () => {
      if (completedRef.current) return;
      if (phase === "questions" || phase === "review") {
        track("questionnaire_abandoned", {
          lastModule: currentSection?.module ?? "review",
          completionPercent: completionPercent(answers),
        });
      }
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [phase, currentSection, answers]);

  const startQuestionnaire = () => {
    const id = profileId || newId();
    setProfileId(id);
    setStartedAt((prev) => prev || new Date().toISOString());
    setPhase("questions");
    track("questionnaire_started");
  };

  const handleAnswer = (id: string, value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setInvalidIds((prev) => prev.filter((qId) => qId !== id));
    if (!answeredOnce.current.has(id)) {
      answeredOnce.current.add(id);
      const q = currentSection?.questions.find((qq) => qq.id === id);
      // Structural only — never the answer value.
      track("question_answered", { questionId: id, type: q?.type ?? "unknown" });
    }
  };

  const goToSection = (index: number) => {
    setInvalidIds([]);
    setSectionIndex(index);
    setPhase("questions");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const handleNext = () => {
    if (!isSectionValid(currentSection, answers)) {
      setInvalidIds(invalidQuestionIds(currentSection, answers));
      return;
    }
    setInvalidIds([]);
    track("section_completed", { module: currentSection.module, index: sectionIndex });
    if (sectionIndex === SECTIONS.length - 1) {
      setPhase("review");
    } else {
      setSectionIndex((i) => i + 1);
    }
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

  async function fetchSnapshot(currentAnswers: Answers): Promise<SnapshotType> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/generate-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: currentAnswers }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { snapshot?: SnapshotType };
      if (!data.snapshot || !Array.isArray(data.snapshot.topActions) || data.snapshot.topActions.length !== 3) {
        throw new Error("invalid snapshot");
      }
      return data.snapshot;
    } finally {
      clearTimeout(timeout);
    }
  }

  const submit = async () => {
    if (completedRef.current || submitting) return;
    setSubmitting(true);
    let result: SnapshotType;
    try {
      result = await fetchSnapshot(answers);
    } catch {
      // AI unavailable or failed — deterministic fallback keeps results working.
      result = generateSnapshot(answers);
    }
    completedRef.current = true;
    setSnapshot(result);
    setPhase("snapshot");
    setSubmitting(false);
    track("questionnaire_completed", { completionPercent: completionPercent(answers) });
    track("snapshot_generated", {
      generatedBy: result.generatedBy,
      actionCount: result.topActions.length,
    });
    // Best-effort — never awaited, never blocks the visitor's results, and
    // any failure here is silently ignored. Stores the response (for /admin)
    // and sends an immediate email notification.
    fetch("/api/submit-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, answers }),
    }).catch(() => {});
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  if (phase === "welcome") {
    return <WelcomeScreen onStart={startQuestionnaire} />;
  }

  if (phase === "snapshot" && snapshot) {
    return (
      <Snapshot
        snapshot={snapshot}
        initialEmail={email}
        onExpandAction={(actionId) => track("recommendation_expanded", { actionId })}
        onRate={(rating, intended) =>
          track("snapshot_rated", { rating, intended: intended ?? "none" })
        }
        onUpgradeClick={() => track("upgrade_waitlist_clicked")}
      />
    );
  }

  if (phase === "review") {
    return (
      <ReviewScreen
        answers={answers}
        email={email}
        onEmailChange={setEmail}
        onEditSection={goToSection}
        onSubmit={submit}
        onBack={() => goToSection(SECTIONS.length - 1)}
        submitting={submitting}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar
        step={sectionIndex + 1}
        totalSteps={TOTAL_STEPS}
        label={currentSection.module}
      />

      <div key={sectionIndex} className="animate-section-in flex flex-col gap-8">
        <div className="flex items-center gap-2.5">
          <SectionIcon module={currentSection.module} />
          <h2 className="font-serif text-2xl sm:text-3xl text-moss">{currentSection.module}</h2>
        </div>

        <div className="flex flex-col gap-8">
          {currentSection.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              answers={answers}
              onAnswer={handleAnswer}
              showError={invalidIds.includes(question.id)}
            />
          ))}
        </div>
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
          {sectionIndex === SECTIONS.length - 1 ? "Review" : "Next"}
        </button>
      </div>
    </div>
  );
}
