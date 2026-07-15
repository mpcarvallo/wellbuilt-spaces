type CheckboxChipProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function CheckboxChip({ label, selected, disabled, onClick }: CheckboxChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      data-option={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-150
        ${
          selected
            ? "border-moss bg-moss text-white scale-[1.04]"
            : disabled
              ? "border-border bg-card text-muted/50 cursor-not-allowed"
              : "border-border bg-card text-foreground hover:border-moss hover:bg-sage/15"
        }`}
    >
      {label}
    </button>
  );
}
