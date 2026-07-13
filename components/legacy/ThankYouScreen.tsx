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
        Thank you. You just helped shape WellBuilt Spaces.
      </h1>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        We&rsquo;re exploring a better way to help people make confident home
        decisions—considering the home, the people living in it, and how design
        choices affect everyday life.
      </p>
      <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
        Your responses will directly influence what we build first. If you
        requested early access, we&rsquo;ll let you know when the WellBuilt Home
        Snapshot is ready.
      </p>

      <div className="mt-2 flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-border bg-card p-5 text-center">
        <span className="text-sm font-medium tracking-wide text-moss uppercase">
          Coming next
        </span>
        <p className="font-serif text-lg text-foreground">The WellBuilt Home Snapshot</p>
        <p className="text-sm text-muted">
          A personalized view of the home decisions most worth your attention.
        </p>
      </div>

      {showEmailCta && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left"
        >
          <label htmlFor="thank-you-email" className="font-serif text-lg text-foreground">
            Want early access when it&rsquo;s ready?
          </label>
          <p className="text-sm text-muted">
            Leave your email and we&rsquo;ll let you know when the WellBuilt Home
            Snapshot is available.
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
