# Claude Code Build Instructions — WellBuilt Home V4

You are working in an existing Next.js 14 TypeScript starter.

## Goal
Turn this prototype into a polished validation MVP for WellBuilt Home: a personalized home wellness and sustainability planning experience based on self-reported information, without onsite testing.

## Preserve
- Moss/cream minimal architectural visual direction.
- Progressive one-question-at-a-time interaction.
- Questionnaire source of truth in `data/questionnaire-v4.ts`.
- Explicit educational/non-diagnostic boundaries.
- Rule-based fallback when no AI key is available.

## Implement in this order
1. Run the app and repair any TypeScript/build errors.
2. Improve mobile and desktop UX, accessibility, keyboard focus, and selected states.
3. Add local autosave and a “Continue where you left off” state.
4. Add a review screen before submission.
5. Connect `/api/generate-snapshot`; on failure use the rule-based result.
6. Render AI output as: Profile summary, Top 3, Later, Questions that improve confidence, Disclaimer.
7. Add email capture after showing the first priority, not before value is delivered.
8. Add analytics using a provider-neutral event helper.
9. Add tests for required answers, maximum three goals, scoring, and API validation.

## Do not build yet
- Native mobile app.
- Photo analysis.
- Product marketplace.
- Community.
- Automated property-data claims.
- Medical or environmental diagnoses.
- Complex gamification.

## Definition of done for validation MVP
- A first-time visitor can finish on mobile in under 7 minutes.
- Progress survives refresh.
- The result gives exactly three prioritized actions.
- Every recommendation explains why, effort, cost, and uncertainty.
- User can rate usefulness and choose which action they would do first.
- Analytics records funnel and value events.
- App passes `npm run build` and `npm run typecheck`.

## Product language
Prefer “Home Potential,” “priorities,” “worth checking,” and “next step.” Avoid “healthy score,” “toxin score,” “safe,” “unsafe,” “detected,” “mold present,” and numerical health claims.
