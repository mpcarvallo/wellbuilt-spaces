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
        How healthy and well-designed does your home feel?
      </h1>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        This 5-minute questionnaire helps us understand what people need most
        when creating healthier, more functional homes. Your answers will
        help shape the first WellBuilt Spaces tools.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-2 rounded-full bg-moss px-8 py-4 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
      >
        Start the questionnaire
      </button>
      <p className="text-sm text-muted max-w-sm">
        Created by an architect exploring practical, AI-assisted tools for
        healthier homes.
      </p>
    </div>
  );
}
