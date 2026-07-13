type EmailCaptureProps = {
  value: string;
  onChange: (value: string) => void;
  id: string;
};

export default function EmailCapture({ value, onChange, id }: EmailCaptureProps) {
  return (
    <input
      id={id}
      type="email"
      inputMode="email"
      autoComplete="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="you@example.com"
      className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150"
    />
  );
}
