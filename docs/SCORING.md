# Scoring — WellBuilt Home V4

## What the scores are (and are not)

WellBuilt Home shows **profile-based indicators**, not measured building
performance. Every value comes only from the answers a person gives in the
questionnaire. There are **no sensors, no laboratory tests, and no on-site
inspection** behind any number. The UI states this explicitly on the results
page ("based on your answers—not on sensors, lab testing, or an on-site
inspection").

Indicators are intentionally **not** framed as a single "Healthy Home Score."
They exist only to help the user see which categories may be worth attention
first. No overall health score, health-risk label, or diagnosis is computed or
stored anywhere.

## Categories

Indicators are grouped into five report categories (`lib/scoring.ts` →
`CATEGORY_LABELS`). These deliberately differ from the questionnaire's raw
`pillar` tags — the moisture question (tagged `air` in the data) belongs to
"Water and moisture," and light + comfort questions combine:

| Category | Questions that feed it |
|---|---|
| Air and ventilation | `cooktop_type`, `kitchen_exhaust` |
| Water and moisture | `moisture_signs` |
| Light and comfort | `bedroom_disruptors`, `daylight`, `bedroom_restfulness`, `clutter_frequency`, `room_temperature`, `acoustics` |
| Materials | `scented_products`, `recent_changes` |
| Maintenance readiness | `hvac_filter` |

There is no "Sustainability" category: the current question set has no
surviving sustainability question (the old `energy_priorities` question was
cut with no replacement), so the category was removed rather than left
permanently showing "not enough detail yet" for every respondent. See
`docs/QUESTIONNAIRE.md` for the full current question list and what changed.

## Method

Risk weights live on the questionnaire options themselves
(`data/questionnaire-v4.ts`, the `risk` field), so scoring stays data-driven —
`lib/scoring.ts` reads them rather than duplicating them.

For each answered question:

- **single-select**: risk = the `risk` weight of the chosen option (0 if none).
- **multi-select**: risk = sum of the `risk` weights of the chosen options.
- **scale (1–5)**: risk = `5 − value` (a lower, less-restorative/less-confident answer means more to look at).

Per category:

```
risk points  = sum of risk from the questions the user ANSWERED
max points   = structural maximum risk for those same answered questions
value        = 100 − (risk / max) × 70,  floored at 30
```

Unanswered questions are excluded from both sums (they don't silently inflate
the value); low coverage instead softens the accompanying note. A category with
no answered risk-bearing questions shows a neutral value and a "not enough
detail yet" note.

## Levels

| Value | Level | Meaning shown to the user |
|---|---|---|
| ≥ 75 | `strong` | "Looks well handled" |
| 50–74 | `developing` | "A few opportunities" |
| < 50 | `attention` | "Worth focusing on" |

## Versioning

`RULES_VERSION` (`lib/scoring.ts`) stamps every generated Snapshot
(`rulesVersion`), so results can be traced to the ruleset that produced them.
The recommendation engine (`lib/recommendations.ts`) shares this version.
