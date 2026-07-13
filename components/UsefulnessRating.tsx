"use client";

import { useState } from "react";
import type { SnapshotAction } from "@/types/home-profile";
import RatingScale from "./RatingScale";

type UsefulnessRatingProps = {
  actions: SnapshotAction[];
  onSubmit: (rating: number, intendedActionId: string | null) => void;
};

export default function UsefulnessRating({ actions, onSubmit }: UsefulnessRatingProps) {
  const [rating, setRating] = useState<number | undefined>();
  const [intended, setIntended] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center text-sm text-moss-dark">
        Thank you — your feedback helps us make this more useful.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-serif text-lg text-foreground">Was this useful?</h3>
        <p className="mt-1 text-sm text-muted">Your answer helps us improve what we recommend.</p>
      </div>

      <RatingScale
        value={rating}
        onChange={setRating}
        minLabel="Not useful"
        maxLabel="Very useful"
      />

      <div>
        <p className="text-sm font-medium text-foreground">Which would you do first?</p>
        <div className="mt-2 grid gap-2">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              data-intended={a.id}
              aria-pressed={intended === a.id}
              onClick={() => setIntended(a.id)}
              className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors duration-150 ${
                intended === a.id
                  ? "border-moss bg-moss text-white"
                  : "border-border bg-background text-foreground hover:border-moss"
              }`}
            >
              {a.title}
            </button>
          ))}
          <button
            type="button"
            data-intended="none"
            aria-pressed={intended === "none"}
            onClick={() => setIntended("none")}
            className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors duration-150 ${
              intended === "none"
                ? "border-moss bg-moss text-white"
                : "border-border bg-background text-foreground hover:border-moss"
            }`}
          >
            None of these right now
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={rating === undefined}
        onClick={() => {
          onSubmit(rating as number, intended);
          setSubmitted(true);
        }}
        className="self-start rounded-full bg-moss px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit feedback
      </button>
    </div>
  );
}
