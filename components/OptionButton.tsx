type OptionButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-option={label}
      onClick={onClick}
      className={`w-full text-left rounded-2xl border px-5 py-4 text-base transition-all duration-150
        ${
          selected
            ? "border-moss bg-moss text-white scale-[1.02]"
            : "border-border bg-card text-foreground hover:border-moss hover:bg-sage/15"
        }`}
    >
      {label}
    </button>
  );
}
