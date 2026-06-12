# Contributing

Thank you for helping make money education free and clear for beginners. Everyone's welcome —
whether you fix a typo, sharpen an explanation, or write a whole lesson.

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

## How to add or edit a lesson

1. Read [CLAUDE.md](CLAUDE.md) → "How to add a lesson" and copy
   [docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md).
2. Create `src/content/lessons/<slug>.md` (slug = `` `${phase}-${order}-<kebab-title>` ``).
3. Follow the **lesson loop**: The situation → The idea → By the numbers (body), plus `doIt`,
   `quiz`, and `keepThis` in the frontmatter. One concept per lesson; ~3–5 min.
4. In `src/data/curriculum.ts`, set the lesson's `status` to `'complete'` and add its `slug`.
5. Run `npm run build` to confirm it compiles, then open a pull request.

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
| HHS / Healthcare.gov | healthcare.gov, hhs.gov | Health insurance terms |
| SEC | investor.gov, sec.gov | Investing definitions and warnings |
| FTC | ftc.gov, consumer.ftc.gov, identitytheft.gov | Scams, fraud, identity theft |
| HUD | hud.gov | Renting and housing |

Anything not on this list — blogs, banks, news sites, content farms — is **not citable in lessons**.

## The finance-accuracy review gate

Some files carry the course's correctness guarantees. Changes to any of these require maintainer
review (enforced by [`.github/CODEOWNERS`](.github/CODEOWNERS)) and are **never auto-merged**:

- `src/calc/` — the calculator math and golden tests
- `src/data/numbers.ts` — yearly US figures (tax brackets, FICA, contribution limits)
- `src/lib/money.ts` — the cents-based money engine
- `scripts/validate-content.mjs` — the build-time content gate
- any ⚙ **mechanics** lesson (the credibility spine — the 14 gear lessons)

For these PRs the pull-request-template checklist is mandatory: link an authoritative reference URL
for every changed value, update and re-run the golden tests, and bump `lastReviewed` on touched
lessons. Yearly-changing figures follow the process in [docs/ANNUAL-REVIEW.md](docs/ANNUAL-REVIEW.md).

## Reporting problems

Found an error or something out of date (a tax number, a rate, a broken link)? Open an issue — the
forms will ask for the lesson id (e.g. "2.3") and, for an error, an authoritative source URL. Pick
"Report an error" to flag a wrong number, "Improve a lesson" to make an explanation clearer, or
"Suggest a lesson" to pitch a missing topic. Accuracy reports are some of the most valuable
contributions.

## Review

Maintainers review every PR for accuracy, plain language, sourcing, and fit with the rules above.
Finance has to be *right*, so factual lessons may take an extra review pass. Thanks for your patience.
