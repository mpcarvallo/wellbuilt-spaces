type WelcomeScreenProps = {
  onStart: () => void;
};

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 sm:py-12">
      <span className="text-sm font-medium tracking-wide text-moss uppercase">
        WellBuilt Home
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground max-w-xl">
        In about seven minutes, find the three home improvements most worth your
        time.
      </h1>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        Answer a few questions about your home, your household, and your goals.
        We&rsquo;ll turn them into a short, personalized Home Snapshot—your top
        priorities, why they matter, and what you can do yourself.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-2 rounded-full bg-moss px-8 py-4 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
      >
        Start the questionnaire
      </button>
      <p className="text-sm text-muted max-w-sm">
        Based on your answers—no sensors, testing, or on-site inspection. This is
        educational guidance, not a diagnosis.
      </p>
    </div>
  );
}
