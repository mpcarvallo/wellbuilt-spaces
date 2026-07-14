type WelcomeScreenProps = {
  onStart: () => void;
};

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="py-4 sm:py-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Text side */}
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12 order-2 md:order-1">
            <div className="flex flex-col gap-6">
              <span className="text-sm font-medium tracking-wide text-moss uppercase">
                WellBuilt Home
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.9rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                Find the{" "}
                <span className="rounded-lg bg-moss px-2.5 py-0.5 text-white">
                  three improvements
                </span>{" "}
                most worth your time.
              </h1>
              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-md">
                Answer a few questions about your home, your household, and your
                goals. In about seven minutes, we&rsquo;ll turn them into a short,
                personalized Home Snapshot&mdash;your top priorities, why they
                matter, and what you can do yourself.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={onStart}
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-moss px-8 py-4 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
              >
                Start the questionnaire
                <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </button>
              <p className="text-sm text-muted max-w-sm leading-relaxed">
                Based on your answers&mdash;no sensors, testing, or on-site
                inspection. This is educational guidance, not a diagnosis.
              </p>
            </div>
          </div>

          {/* Image side.
              Hero photo: Unsplash (free license) — photo-1548362851-ea052637ad64.
              Self-hosted at public/hero-abstract.jpg. */}
          <div
            role="img"
            aria-label="Soft, out-of-focus green foliage and light"
            className="relative min-h-[260px] sm:min-h-[340px] md:min-h-full bg-cover bg-center order-1 md:order-2"
            style={{ backgroundImage: "url('/hero-abstract.jpg')" }}
          >
            <Pill className="left-5 top-5">Cleaner air</Pill>
            <Pill className="right-5 top-1/2">Better light</Pill>
            <Pill className="left-8 bottom-6">Less moisture</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`absolute inline-flex items-center gap-2 rounded-full bg-card/95 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-md backdrop-blur-sm ${className ?? ""}`}
    >
      <span className="h-2 w-2 rounded-full bg-moss" />
      {children}
    </span>
  );
}
