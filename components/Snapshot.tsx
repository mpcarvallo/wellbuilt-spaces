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

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? "Something went wrong. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

function EmailCaptureCard({
  snapshot,
  onSubmit,
}: {
  snapshot: SnapshotType;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center text-sm text-moss-dark">
        Sent — check your inbox for your full Snapshot.
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || sending) return;
        setSending(true);
        setError(null);
        const result = await postJson("/api/send-snapshot", { email: trimmed, snapshot });
        setSending(false);
        if (!result.ok) {
          setError(result.error ?? "Something went wrong. Please try again.");
          return;
        }
        onSubmit(trimmed);
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
          disabled={sending}
          className="shrink-0 rounded-full bg-moss px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending…" : "Send it"}
        </button>
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
    </form>
  );
}

function WaitlistCard({ onJoined }: { onJoined?: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border border-moss/40 bg-sage/15 p-5 sm:p-6 text-center flex flex-col gap-3">
      <h2 className="font-serif text-xl text-foreground">Want the full plan?</h2>
      <p className="text-sm text-muted max-w-lg mx-auto">
        A complete Home Roadmap would include every prioritized action, a room-by-room sequence,
        and a 90-day plan. We&rsquo;re gauging interest before building it.
      </p>

      {done ? (
        <p className="text-sm text-moss-dark">You&rsquo;re on the list — we&rsquo;ll be in touch.</p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmed = email.trim();
            if (!trimmed || sending) return;
            setSending(true);
            setError(null);
            const result = await postJson("/api/waitlist", { email: trimmed });
            setSending(false);
            if (!result.ok) {
              setError(result.error ?? "Something went wrong. Please try again.");
              return;
            }
            setDone(true);
            onJoined?.();
          }}
          className="flex flex-col gap-2 sm:flex-row sm:justify-center"
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email for the waitlist"
            className="w-full sm:max-w-xs rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150"
          />
          <button
            type="submit"
            data-nav="upgrade"
            disabled={sending}
            className="shrink-0 rounded-full bg-moss px-8 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Joining…" : "Join the waitlist"}
          </button>
        </form>
      )}
      {error && <p className="text-sm text-clay">{error}</p>}
    </section>
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
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-moss max-w-2xl mx-auto">
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

        <EmailCaptureCard snapshot={snapshot} onSubmit={onEmailSubmit} />

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

      <WaitlistCard onJoined={onUpgradeClick} />

      <Disclaimer text={snapshot.disclaimer} />
    </div>
  );
}
