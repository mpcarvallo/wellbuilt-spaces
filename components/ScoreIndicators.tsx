import type { CategoryIndicator, IndicatorLevel } from "@/types/home-profile";

const LEVEL_STYLES: Record<IndicatorLevel, { dot: string; label: string }> = {
  attention: { dot: "bg-clay", label: "Worth focusing on" },
  developing: { dot: "bg-sage", label: "A few opportunities" },
  strong: { dot: "bg-moss", label: "Looks well handled" },
};

type ScoreIndicatorsProps = {
  indicators: CategoryIndicator[];
};

export default function ScoreIndicators({ indicators }: ScoreIndicatorsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-serif text-xl text-foreground">Your home at a glance</h3>
        <p className="mt-1 text-sm text-muted">
          These indicators are based on your answers—not on sensors, lab testing, or an on-site
          inspection. They point to where attention may help most.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {indicators.map((ind) => {
          const style = LEVEL_STYLES[ind.level];
          return (
            <div
              key={ind.category}
              className="rounded-2xl border border-border bg-card p-4"
              data-indicator={ind.category}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-foreground">{ind.label}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} aria-hidden />
                  {style.label}
                </span>
              </div>
              <div
                className="mt-3 h-2 w-full rounded-full bg-border overflow-hidden"
                role="meter"
                aria-valuenow={ind.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${ind.label}: profile-based indicator ${ind.value} of 100`}
              >
                <div
                  className="h-full rounded-full bg-moss transition-all duration-500 ease-out"
                  style={{ width: `${ind.value}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">{ind.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
