"use client";

import { useState } from "react";
import type { SnapshotAction } from "@/types/home-profile";
import { CONFIDENCE_LABELS, COST_LABELS, EFFORT_LABELS, PILLAR_LABELS } from "@/lib/labels";

type ActionCardProps = {
  action: SnapshotAction;
  rank: number;
  /** Whether the detailed steps start expanded (used for the first, free detailed action). */
  defaultExpanded?: boolean;
  onExpand?: (actionId: string) => void;
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

export default function ActionCard({ action, rank, defaultExpanded = false, onExpand }: ActionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) onExpand?.(action.id);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6" data-action={action.id}>
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-medium text-white">
          {rank}
        </span>
        <div className="flex-1">
          <h3 className="font-serif text-lg sm:text-xl text-foreground">{action.title}</h3>
          <p className="mt-2 text-base text-muted leading-relaxed">{action.why}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>{EFFORT_LABELS[action.effort]}</Chip>
            <Chip>{COST_LABELS[action.costBand]}</Chip>
            <Chip>{action.diyFriendly ? "DIY-friendly" : "Usually a pro"}</Chip>
            <Chip>{CONFIDENCE_LABELS[action.confidence]}</Chip>
            {action.categories.map((c) => (
              <Chip key={c}>{PILLAR_LABELS[c]}</Chip>
            ))}
          </div>

          {action.steps && action.steps.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={toggle}
                aria-expanded={expanded}
                data-nav="expand-action"
                className="text-sm font-medium text-moss hover:text-moss-dark transition-colors duration-150"
              >
                {expanded ? "Hide steps" : "Show me how"}
              </button>
              {expanded && (
                <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-foreground">
                  {action.steps.map((step, i) => (
                    <li key={i} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {action.professionalNote && (
            <p className="mt-3 rounded-xl bg-background px-4 py-3 text-sm text-muted leading-relaxed">
              {action.professionalNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
