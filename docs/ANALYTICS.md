# Analytics — WellBuilt Home V4

Analytics are provider-neutral. `lib/analytics.ts` exposes a single `track()`
helper that dispatches to whatever provider is present on the page (Plausible,
GA/`gtag`, or a `dataLayer`) and falls back to a `console.debug` in
development. Swapping providers is a one-file change; no provider SDK is
hard-wired.

## Privacy

`track()` **never forwards free-text answers or PII.** Callers pass only
structural properties (question ids, counts, enums). As a safety net, `track()`
drops a denylist of sensitive keys (`email`, `open_note`, `zip_code`, `note`,
`answer`, `value`, `text`) and truncates any string property to 64 characters.
The open-text answers (`open_note`, etc.) and the user's email are therefore
never sent to analytics.

## Events

| Event | Fires when | Properties |
|---|---|---|
| `questionnaire_started` | User clicks "Start the questionnaire" | — |
| `section_completed` | A section (module) passes validation on "Next" | `module`, `index` |
| `question_answered` | A question is answered for the first time | `questionId`, `type` (no value) |
| `questionnaire_abandoned` | Page hidden/closed mid-questionnaire | `lastModule`, `completionPercent` |
| `questionnaire_completed` | Snapshot successfully generated | `completionPercent` |
| `snapshot_generated` | Snapshot rendered | `generatedBy` (`ai`/`rules`), `actionCount` |
| `snapshot_rated` | User submits the usefulness rating | `rating` (1–5), `intended` (action id or `none`) |
| `recommendation_expanded` | User expands an action's steps | `actionId` |
| `email_submitted` | User submits the results-page email | `where` (no email) |
| `upgrade_waitlist_clicked` | User clicks "Join the waitlist" | — |

## Wiring a real provider

Include the provider's snippet in `app/layout.tsx` (or via a `<Script>`), and
`track()` will pick it up automatically — e.g. Plausible exposes
`window.plausible`, GA exposes `window.gtag`. No code change to `lib/analytics.ts`
is required.
