type RatingScaleProps = {
  value: number | undefined;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
};

export default function RatingScale({ value, onChange, minLabel, maxLabel }: RatingScaleProps) {
  return (
    <div>
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            data-rating={n}
            aria-label={`${n}${minLabel && n === 1 ? `, ${minLabel}` : ""}${
              maxLabel && n === 5 ? `, ${maxLabel}` : ""
            }`}
            onClick={() => onChange(n)}
            className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border text-base font-medium transition-all duration-150
              ${
                value === n
                  ? "border-moss bg-moss text-white scale-105"
                  : "border-border bg-card text-foreground hover:border-moss hover:bg-sage/15"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
