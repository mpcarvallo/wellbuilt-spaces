type DisclaimerProps = {
  text: string;
};

export default function Disclaimer({ text }: DisclaimerProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <p className="text-sm text-muted leading-relaxed">
        <span className="font-medium text-foreground">A note on how this works. </span>
        {text}
      </p>
    </div>
  );
}
