type TextAreaQuestionProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id: string;
};

export default function TextAreaQuestion({ value, onChange, placeholder, id }: TextAreaQuestionProps) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150 resize-none"
    />
  );
}
