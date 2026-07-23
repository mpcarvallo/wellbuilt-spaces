"use client";

import { useEffect, useState } from "react";
import type { SubmissionRecord } from "@/types/submission";
import { SECTIONS } from "@/lib/sections";
import { displayAnswer } from "@/lib/answer-labels";

type LoadState =
  | { status: "checking" }
  | { status: "needs-login" }
  | { status: "not-configured" }
  | { status: "error"; message: string }
  | { status: "ready"; submissions: SubmissionRecord[] };

async function fetchSubmissions(): Promise<LoadState> {
  const res = await fetch("/api/admin/submissions");
  if (res.status === 401) return { status: "needs-login" };
  if (res.status === 503) return { status: "not-configured" };
  if (!res.ok) return { status: "error", message: "Could not load submissions." };
  const data = (await res.json()) as { submissions: SubmissionRecord[] };
  return { status: "ready", submissions: data.submissions };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function SubmissionDetail({ submission }: { submission: SubmissionRecord }) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      {SECTIONS.map((section) => {
        const rows = section.questions
          .map((q) => ({ q, value: displayAnswer(q, submission.answers) }))
          .filter(({ value }) => value !== "—");
        if (rows.length === 0) return null;
        return (
          <div key={section.module}>
            <p className="text-xs font-semibold uppercase tracking-wide text-moss">
              {section.module}
            </p>
            <dl className="mt-1.5 flex flex-col gap-1.5">
              {rows.map(({ q, value }) => (
                <div key={q.id} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                  <dt className="text-sm text-muted sm:w-64 sm:shrink-0">{q.title}</dt>
                  <dd className="text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            setError(data.error ?? "Incorrect password.");
            return;
          }
          onSuccess();
        } catch {
          setError("Something went wrong. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
      className="mx-auto flex max-w-sm flex-col gap-3 rounded-2xl border border-border bg-card p-6"
    >
      <h1 className="font-serif text-xl text-moss">Admin sign in</h1>
      <input
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:border-moss transition-colors duration-150"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-moss px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark disabled:opacity-50"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
      {error && <p className="text-sm text-clay">{error}</p>}
    </form>
  );
}

export default function AdminPage() {
  const [state, setState] = useState<LoadState>({ status: "checking" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => {
    setState({ status: "checking" });
    fetchSubmissions()
      .then(setState)
      .catch(() => setState({ status: "error", message: "Could not load submissions." }));
  };

  // One-time fetch-from-server on mount (an external system) — exactly what
  // effects are for, per the same convention used in Questionnaire.tsx.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(load, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:py-16">
      {state.status === "checking" && <p className="text-center text-muted">Loading…</p>}

      {state.status === "needs-login" && <LoginForm onSuccess={load} />}

      {state.status === "not-configured" && (
        <p className="text-center text-muted">
          No database is connected yet. See docs/ADMIN.md for setup steps.
        </p>
      )}

      {state.status === "error" && (
        <p className="text-center text-clay">{state.message}</p>
      )}

      {state.status === "ready" && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl text-moss">
              Submissions ({state.submissions.length})
            </h1>
            <button
              type="button"
              onClick={() => fetch("/api/admin/logout", { method: "POST" }).then(load)}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-150"
            >
              Sign out
            </button>
          </div>

          {state.submissions.length === 0 && (
            <p className="text-muted">No completed questionnaires yet.</p>
          )}

          <div className="flex flex-col gap-3">
            {state.submissions.map((s) => {
              const expanded = expandedId === s.id;
              return (
                <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : s.id)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="font-medium text-foreground">{s.email}</p>
                      <p className="text-sm text-muted">{formatDate(s.createdAt)}</p>
                    </div>
                    <span className="text-sm font-medium text-moss">
                      {expanded ? "Hide" : "View"}
                    </span>
                  </button>
                  {expanded && (
                    <div className="mt-4">
                      <SubmissionDetail submission={s} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
