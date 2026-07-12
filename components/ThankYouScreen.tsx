import { useState } from "react";

type ThankYouScreenProps = {
  showEmailCta: boolean;
  onEmailSubmit: (email: string) => void;
};

export default function ThankYouScreen({ showEmailCta, onEmailSubmit }: ThankYouScreenProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onEmailSubmit(email.trim());
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 sm:py-12">
      <span className="text-sm font-medium tracking-wide text-moss uppercase">
        Thank you
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground max-w-lg">
        Thank you for helping shape WellBuilt Spaces.
      </h1>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        Your answers will help us build practical tools for healthier,
        better-designed homes — without the overwhelm.
      </p>
      <p className="text-sm text-muted max-w-sm">
        Next, we are building a personalized Healthy Home Score that gives
        people a simple snapshot of their home&rsquo;s strengths, risks, and
        next best actions.
      </p>

      {showEmailCta && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left"
        >
          <label htmlFor="thank-you-email" className="font-serif text-lg text-foreground">
            Want to be part of the first test group?
          </label>
          <p className="text-sm text-muted">
            Leave your email and we will invite you when the Healthy Home
            Score is ready.
          </p>
          <input
            id="thank-you-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted/70 focus:border-moss transition-colors duration-150"
          />
          <button
            type="submit"
            className="rounded-full bg-moss px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-moss-dark"
          >
            Keep me posted
          </button>
        </form>
      )}

      {showEmailCta && submitted && (
        <p className="rounded-2xl border border-border bg-card px-5 py-4 text-sm text-moss-dark">
          You&rsquo;re on the list — thank you!
        </p>
      )}
    </div>
  );
}
