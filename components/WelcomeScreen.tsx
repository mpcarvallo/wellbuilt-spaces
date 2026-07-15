type WelcomeScreenProps = {
  onStart: () => void;
};

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="py-4 sm:py-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Eyebrow */}
        <div className="flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-8">
          <span className="text-sm font-semibold tracking-wide text-foreground uppercase">
            WellBuilt Spaces
          </span>
          <a
            href="https://www.instagram.com/wellbuiltspaces/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WellBuilt Spaces on Instagram"
            className="text-muted transition-colors duration-150 hover:text-moss"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              className="h-5 w-5"
            >
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

        {/* Hero image with the headline + CTA overlaid on top.
            Hero photo: Unsplash (free license) — photo-1548362851-ea052637ad64.
            Self-hosted at public/hero-abstract.jpg. */}
        <div
          role="img"
          aria-label="Soft, out-of-focus green foliage and light"
          className="relative mt-5 min-h-[380px] sm:min-h-[460px] bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-abstract.jpg')" }}
        >
          {/* Light scrim keeps the dark heading legible over the photo. */}
          <div className="absolute inset-0 bg-gradient-to-r from-card/85 via-card/45 to-transparent" />
          <div className="relative flex h-full min-h-[380px] sm:min-h-[460px] max-w-xl flex-col justify-center gap-7 p-8 sm:p-10 lg:p-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight text-moss-dark">
              Find the three <span className="italic">improvements</span> most
              worth your time.
            </h1>
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-moss px-8 py-4 text-base font-medium text-white shadow-sm transition-colors duration-150 hover:bg-moss-dark"
            >
              Start the questionnaire
              <span
                aria-hidden
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </button>
          </div>
        </div>

        {/* Supporting copy + disclaimer below the image */}
        <div className="flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
          <p className="max-w-2xl text-base sm:text-lg text-muted leading-relaxed">
            Answer a few questions about your home, your household, and your
            goals. In about seven minutes, we&rsquo;ll turn them into a short,
            personalized Home Snapshot&mdash;your top priorities, why they matter,
            and what you can do yourself.
          </p>
          <hr className="border-t border-border" />
          <p className="max-w-2xl text-sm text-muted leading-relaxed">
            Based on your answers&mdash;no sensors, testing, or on-site
            inspection. This is educational guidance, not a diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}
