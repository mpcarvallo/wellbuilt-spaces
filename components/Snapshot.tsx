"use client";

import { useState } from "react";
import type { Snapshot as SnapshotType } from "@/types/home-profile";
import ActionCard from "./ActionCard";
import ScoreIndicators from "./ScoreIndicators";
import UsefulnessRating from "./UsefulnessRating";
import Disclaimer from "./Disclaimer";

type SnapshotProps = {
  snapshot: SnapshotType;
  onEmailSubmit: (email: string) => void;
  onExpandAction?: (actionId: string) => void;
  onRate?: (rating: number, intendedActionId: string | null) => void;
  onUpgradeClick?: () => void;
};

function EmailCaptureCard({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center text-sm text-moss-dark">
        Thanks — we&rsquo;ll send your full Snapshot and save your progress.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onSubmit(email.trim());
        setDone(true);
      }}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col gap-3"
    >
      <label htmlFor="snapshot-email" className="font-serif text-lg text-foreground">
        Want your full Snapshot and a saved profile?
      </label>
      <p className="text-sm text-muted">
        We&rsquo;ll email your complete set of priorities and let you pick up where you left off.
        We only use your email for WellBuilt updates.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="snapshot-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-moss px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
        >
          Send it
        </button>
      </div>
    </form>
  );
}

export default function Snapshot({
  snapshot,
  onEmailSubmit,
  onExpandAction,
  onRate,
  onUpgradeClick,
}: SnapshotProps) {
  const [first, ...rest] = snapshot.topActions;

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center flex flex-col gap-3">
        <span className="text-sm font-medium tracking-wide text-moss uppercase">
          Your Home Snapshot
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground max-w-2xl mx-auto">
          {snapshot.intro}
        </h1>
        <p className="text-sm text-muted">
          {snapshot.generatedBy === "ai"
            ? "Personalized from your answers."
            : "Prepared instantly from your answers."}
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-foreground">Start here: your top three</h2>
        {first && (
          <ActionCard action={first} rank={1} defaultExpanded onExpand={onExpandAction} />
        )}

        <EmailCaptureCard onSubmit={onEmailSubmit} />

        {rest.map((action, i) => (
          <ActionCard key={action.id} action={action} rank={i + 2} onExpand={onExpandAction} />
        ))}
      </section>

      {snapshot.later.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-serif text-xl text-foreground">Later, not now</h2>
          <p className="mt-1 text-sm text-muted">
            Worth keeping in mind once your top three are underway.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {snapshot.later.map((item, i) => (
              <li key={i} className="text-sm text-foreground">
                {item.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ScoreIndicators indicators={snapshot.indicators} />

      {snapshot.missingInfo.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-serif text-xl text-foreground">Sharpen your results</h2>
          <p className="mt-1 text-sm text-muted">
            Answering these would improve the confidence of your guidance:
          </p>
          <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-foreground">
            {snapshot.missingInfo.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      <UsefulnessRating
        actions={snapshot.topActions}
        onSubmit={(rating, intended) => onRate?.(rating, intended)}
      />

      <section className="rounded-2xl border border-moss/40 bg-sage/15 p-5 sm:p-6 text-center flex flex-col gap-3">
        <h2 className="font-serif text-xl text-foreground">Want the full plan?</h2>
        <p className="text-sm text-muted max-w-lg mx-auto">
          A complete Home Roadmap would include every prioritized action, a room-by-room sequence,
          and a 90-day plan. We&rsquo;re gauging interest before building it.
        </p>
        <button
          type="button"
          data-nav="upgrade"
          onClick={() => onUpgradeClick?.()}
          className="self-center rounded-full bg-moss px-8 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
        >
          Join the waitlist
        </button>
      </section>

      <Disclaimer text={snapshot.disclaimer} />
    </div>
  );
}
