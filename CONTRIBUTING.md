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
6. **Cite authoritative sources** for any numbers: IRS, CFPB, SSA, Federal Reserve, FINRA Foundation.
   Avoid random blogs. Add a `lastReviewed` date.

## How to add or edit a lesson

1. Read [CLAUDE.md](CLAUDE.md) → "How to add a lesson" and copy
   [docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md).
2. Create `src/content/lessons/<slug>.md` (slug = `` `${phase}-${order}-<kebab-title>` ``).
3. Follow the **lesson loop**: The situation → The idea → By the numbers (body), plus `doIt`,
   `quiz`, and `keepThis` in the frontmatter. One concept per lesson; ~3–5 min.
4. In `src/data/curriculum.ts`, set the lesson's `status` to `'complete'` and add its `slug`.
5. Run `npm run build` to confirm it compiles, then open a pull request.

## Reporting problems

Found an error or something out of date (a tax number, a rate, a broken link)? Open an issue with the
lesson id (e.g. "2.3") and what's wrong. Accuracy reports are some of the most valuable contributions.

## Review

Maintainers review every PR for accuracy, plain language, sourcing, and fit with the rules above.
Finance has to be *right*, so factual lessons may take an extra review pass. Thanks for your patience.
