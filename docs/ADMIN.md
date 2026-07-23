# Admin dashboard — WellBuilt Home

`/admin` is a password-protected page for viewing every completed
questionnaire: each respondent's email and their full set of answers, grouped
by section exactly like the in-app Review screen.

## Setup (one-time, in the Vercel dashboard)

1. **Database.** Project → **Storage** tab → **Create Database** → choose the
   Postgres option (Neon). Connect it to this project. Vercel automatically
   adds a `DATABASE_URL` (or `POSTGRES_URL`) environment variable — no manual
   copying needed. `lib/db.ts` creates its `submissions` table itself on first
   use.
2. **Admin password.** Project → **Settings → Environment Variables** → add
   `ADMIN_PASSWORD` with a password of your choice, for all environments.
   Redeploy after adding it.
3. Visit `https://<your-domain>/admin` and sign in with that password.

Until both are set, `/admin` shows a sign-in form (once `ADMIN_PASSWORD`
exists) or a "no database connected" message (until the store is linked) —
nothing breaks, it just isn't usable yet.

## How data gets there

`components/Questionnaire.tsx` now requires an email address on the Review
screen before generating a Snapshot. On submit, `/api/submit-response` stores
`{ email, answers }` as one row and — best-effort, non-blocking — also emails
a notification copy to `RESEND_NOTIFY_EMAIL` (see `docs/` for the Resend
setup). The database is the reliable record; the email is a convenience on
top of it.

## Session

Signing in sets an httpOnly, 30-day cookie (`lib/admin-auth.ts`), verified
with an HMAC keyed by `ADMIN_PASSWORD` — no separate session store needed.
"Sign out" on the page clears it.
