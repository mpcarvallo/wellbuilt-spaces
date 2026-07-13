type WelcomeScreenProps = {
  onStart: () => void;
};

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 sm:py-12">
      <span className="text-sm font-medium tracking-wide text-moss uppercase">
        WellBuilt Spaces
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground max-w-lg">
        Your home comes with hundreds of decisions. Which ones are actually
        worth your attention?
      </h1>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        We&rsquo;re exploring a new way to help people make more confident home
        and renovation decisions—considering not just cost and appearance, but
        how a space supports everyday life and wellbeing.
      </p>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        This short questionnaire takes about 5 minutes. Your answers will help
        shape WellBuilt Spaces.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-2 rounded-full bg-moss px-8 py-4 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
      >
        Start the questionnaire
      </button>
      <p className="text-sm text-muted max-w-sm">
        No technical home knowledge required.
      </p>
    </div>
  );
}
