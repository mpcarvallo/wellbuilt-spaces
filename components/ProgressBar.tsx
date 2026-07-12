type ProgressBarProps = {
  step: number;
  totalSteps: number;
  label: string;
};

export default function ProgressBar({ step, totalSteps, label }: ProgressBarProps) {
  const percent = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="text-sm text-muted">
          Step {step} of {totalSteps}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Questionnaire progress: ${label}, step ${step} of ${totalSteps}`}
        className="h-2 w-full rounded-full bg-border overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-moss transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
