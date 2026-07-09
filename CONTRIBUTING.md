# Contributing

Thank you for helping make money education free and clear for beginners. Everyone's welcome —
whether you fix a typo, sharpen an explanation, correct a number, or write a whole lesson.

## Ground rules (please read)

This is a beginner course with a specific mission. Contributions must fit it:

1. **Education-first, not promotion.** Don't add product pitches, affiliate links, or CTAs. (The one
   intentional Toya mention lives in lesson 8.8 — leave product placement to maintainers.)
2. **Not financial advice.** Write general education, not personalized recommendations.
3. **US-only** content (W-4, FICA, 401(k), Roth IRA, US credit scoring, etc.).
4. **Beginner general finance, not investing-heavy.** Keep investing light and late (Phase 14).
5. **Plain language, zero jargon, zero shame.** Define every term the first time. Be warm, never
   preachy. No shaming people for debt or spending.
6. **Cite authoritative sources** for any numbers — see **Authoritative sources (the whitelist)**
   below. Avoid random blogs. Add a `lastReviewed` date.

## Getting set up

Requires **Node 24+**.

```bash
git clone https://github.com/debtzero-club/learn-personal-finance-from-scratch.git
cd learn-personal-finance-from-scratch
npm install
npm run dev      # http://localhost:4321
```

- `npm run build` — full static build (runs the content validator first).
- `npm run validate` — run the content gate on its own.
- `npm test` — run the calculator + content test suite.

## Ways to contribute

- **Report an error** (a wrong number, a rate that changed, a broken link). Accuracy reports are some
  of the most valuable contributions — open an issue with the lesson id and an authoritative source URL.
- **Improve a lesson** — make an explanation clearer, warmer, or shorter without changing the meaning.
- **Write a planned lesson.** Some entries in `src/data/curriculum.ts` may be `status: 'planned'`
  (no file yet). Pick one and write it (below).
- **Suggest a lesson** — pitch a missing beginner topic via an issue.

Small fixes can go straight to a PR. For anything larger (a new lesson or a reworked explanation),
opening an issue first is appreciated so we can agree on the shape.

## How to add or edit a lesson

1. Copy [docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md) — it carries the full
   lesson shape with inline guidance.
2. Create `src/content/lessons/<slug>.md` (slug = `` `${phase}-${order}-<kebab-title>` ``,
   e.g. `2-1-gross-vs-net`).
3. Fill in **all** frontmatter required by `src/content/config.ts` (`id`, `track`, `phase`, `order`,
   `title`, `summary`, `status`, `mechanics`, `lastReviewed`, `doIt`, `keepThis`, `quiz[]`,
   `sources[]`). The `id` must match the one in `curriculum.ts`.
4. Write the body as the **lesson loop**: `## The situation` → `## The idea` → `## By the numbers`.
   Keep it to one concept, ~3–5 minutes. `doIt`, `keepThis`, and `quiz` live in the frontmatter.
5. In `src/data/curriculum.ts`, set the lesson's `status` to `'complete'` and add its `slug`.
6. Run `npm run validate && npm test && npm run build`. When all pass, open a pull request.

Adding an interactive calculator to a ⚙ mechanics lesson? Read
[docs/CALCULATORS.md](docs/CALCULATORS.md) first — it's the binding contract (integer-cents math,
golden tests, no-JS fallback).

## The quality bar (what a PR must clear)

- [ ] One concept only; ~3–5 minutes to read; ends in a real `doIt` action.
- [ ] 3–5 quiz questions, each with an explanation.
- [ ] Plain language, no undefined jargon, no shame, US-specific.
- [ ] Every factual number is sourced from the whitelist below, and `lastReviewed` is set.
- [ ] `curriculum.ts` updated: `status: 'complete'` + `slug` added.
- [ ] `npm run validate`, `npm test`, and `npm run build` all pass locally.

The validator (`scripts/validate-content.mjs`, run automatically on build) enforces the mechanical
parts: curriculum ↔ file sync, the slug pattern, at least one `sources[]` entry per lesson, in-range
quiz answers, and a staleness check on yearly figures.

## Authoritative sources (the whitelist)

Every factual number, rate, or rule in a lesson must trace to one of these sources. This is the
single canonical list — if it isn't here, it isn't citable in a lesson.

| Source | Domain(s) | Use for |
|--------|-----------|---------|
| IRS | irs.gov | Tax brackets, deductions, limits, FICA, self-employment tax |
| SSA | ssa.gov | Social Security wage base and rates |
| CFPB | consumerfinance.gov, files.consumerfinance.gov | Banking, credit, debt, consumer protections |
| Federal Reserve | federalreserve.gov | Rates, household-finance data (SHED) |
| FINRA Foundation / FINRA | finrafoundation.org, finra.org | Saving, investing basics, market history |
| Federal Student Aid | studentaid.gov | Student loans, repayment plans, forgiveness |
| HHS / HealthCare.gov | healthcare.gov, hhs.gov | Health insurance terms |
| SEC | investor.gov, sec.gov | Investing definitions and warnings |
| FTC | ftc.gov, consumer.ftc.gov, identitytheft.gov | Scams, fraud, identity theft |
| HUD | hud.gov | Renting and housing |

Anything not on this list — blogs, banks, news sites, content farms — is **not citable in lessons**.

## The finance-accuracy review gate

Some files carry the course's correctness guarantees. Changes to any of these require maintainer
review (enforced by [`.github/CODEOWNERS`](.github/CODEOWNERS)) and are **never auto-merged**:

- `src/calc/` — the calculator math and golden tests
- `src/lib/money.ts` — the cents-based money engine
- `src/data/numbers.ts` — yearly US figures (tax brackets, FICA, contribution limits)
- `scripts/validate-content.mjs` — the build-time content gate
- any ⚙ **mechanics** lesson (the credibility spine — the 14 gear lessons)

For these PRs the pull-request-template checklist is mandatory: link an authoritative reference URL
for every changed value, update and re-run the golden tests, and bump `lastReviewed` on touched
lessons. Yearly-changing figures follow the process in [docs/ANNUAL-REVIEW.md](docs/ANNUAL-REVIEW.md).

## Reporting problems

Found an error or something out of date (a tax number, a rate, a broken link)? Open an issue — the
forms will ask for the lesson id (e.g. "2.3") and, for an error, an authoritative source URL. Pick
"Report an error" to flag a wrong number, "Improve a lesson" to make an explanation clearer, or
"Suggest a lesson" to pitch a missing topic.

## Review

Maintainers review every PR for accuracy, plain language, sourcing, and fit with the rules above.
Finance has to be *right*, so factual lessons may take an extra review pass. Thanks for your patience.
