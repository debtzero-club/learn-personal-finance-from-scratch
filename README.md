# Learn Personal Finance from Scratch

**A free, open-source course that teaches you money from the ground up — built for your first paycheck, not your stock portfolio.**

The internet is full of investing content, but almost nobody teaches the everyday basics: how a
paycheck actually works, what a credit card really does, how interest works for you and against you,
how to dig out of debt. This course fills that gap — in plain English, with no jargon and no shame.

- **Free forever. No signup, no paywall, no ads, no tracking.** Your progress is saved in your browser only.
- **US-focused**, for total beginners — especially people at or near their first real job (roughly ages 18–24).
- **One concept per lesson, ~3–5 minutes each**, always ending in one concrete action.
- **Open source** — anyone can improve it. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Educational only — not financial advice.**

Built and maintained by the team at [Toya](https://usetoya.com) and contributors. It's
education-first on purpose: there are no CTAs, and exactly one soft, optional mention of Toya in a
single lesson (8.8). That restraint is the point.

---

## What makes it different

Most "learn money" resources are a wall of articles. This one is built around a few deliberate ideas:

- **Every lesson runs the same short loop**, so you always know what you're getting:
  **the situation → the idea → by the numbers → do it → check yourself → keep this.** Read it in a
  few minutes, do one small thing, move on.
- **The ⚙ "mechanics" lessons are the credibility spine.** The hard-but-essential topics — compound
  interest, how a card calculates interest, the minimum-payment trap, loan amortization, debt types —
  are taught with a live, interactive calculator, not just prose. There are 14 of these across the
  course.
- **The numbers are engine-verified.** The calculators are pure TypeScript engines that do all money
  math in **integer cents** (no floating-point drift). Their outputs are pinned to exact cents by a
  golden-test suite, and the same engine renders the worked example, so a lesson can never quietly
  disagree with its own calculator. The calculators are progressive-enhancement islands: **with
  JavaScript off, a correct static example still shows.**
- **Sourcing is enforced by the build.** A content validator runs before every build. It keeps the
  curriculum and lesson files in sync, requires every lesson to cite at least one source, and audits
  the yearly-changing tax figures for staleness. Numbers may only cite an authoritative source (IRS,
  CFPB, SSA, Federal Reserve, FINRA Foundation, FTC, SEC, Federal Student Aid, HUD, HealthCare.gov).

## Curriculum

Two tracks, 14 phases, 92 lessons. Phases marked ⚙ contain the mechanics lessons with live
calculators. The full outline lives in [`src/data/curriculum.ts`](src/data/curriculum.ts).

### Track 1 — Foundations
*Start here — money from your first paycheck.*

| Phase | Title | Lessons |
|------:|-------|:-------:|
| 1 | How Money Works | 6 |
| 2 | Your Paycheck & First Taxes | 7 |
| 3 | Banking Without Getting Robbed (by fees) | 6 |
| 4 | Budgeting That Doesn't Suck | 7 |
| 5 | Saving & Your Safety Net | 5 |
| 6 ⚙ | Interest & Compounding — The Engine | 7 |
| 7 ⚙ | Credit, Decoded | 11 |

### Track 2 — Real-Life Money
*Debt, big decisions, and building.*

| Phase | Title | Lessons |
|------:|-------|:-------:|
| 8 ⚙ | Getting Out of Debt (+ How Loans Work) | 12 |
| 9 ⚙ | Student Loans (US) | 5 |
| 10 | Free Money at Work (Benefits) | 5 |
| 11 | Taxes, A Bit Deeper | 5 |
| 12 | Protecting Yourself (Insurance & Risk) | 5 |
| 13 | Big Money Decisions | 5 |
| 14 | Growing Your Money | 6 |

The six calculators — **compound interest**, **APR ↔ APY**, **card interest** (average daily
balance), the **minimum-payment trap**, loan **amortization**, and **avalanche-vs-snowball payoff** —
all reuse the same integer-cents engine. See [docs/CALCULATORS.md](docs/CALCULATORS.md) for the math
and the pinned golden figures.

## Quickstart

Requires **Node 24+**.

```bash
git clone https://github.com/debtzero-club/learn-personal-finance-from-scratch.git
cd learn-personal-finance-from-scratch
npm install

npm run dev      # local dev server at http://localhost:4321
npm run build    # static build to dist/ (runs the content validator first)
npm run preview  # preview the production build
npm test         # run the calculator + content test suite (72 tests)
```

You can also run the content validator on its own with `npm run validate`.

## How it works

It's a static [Astro](https://astro.build) site with **zero runtime dependencies beyond Astro** — no
backend, no database, no accounts.

- **Content collections.** Each lesson is a Markdown file in `src/content/lessons/`, with frontmatter
  validated at build time by a Zod schema in `src/content/config.ts` (the six-part loop is enforced
  by that schema).
- **One source of truth for the outline.** [`src/data/curriculum.ts`](src/data/curriculum.ts) lists
  every lesson, its phase, and whether it's a ⚙ mechanics lesson. Pages (home, catalog, roadmap) read
  from it.
- **Calculator engines + islands.** Pure engines live in `src/calc/` and route every money step
  through the integer-cents helpers in `src/lib/money.ts`. Each has an exact-value golden test. The
  matching `*Calc.astro` component server-renders a correct example from the engine, then a small
  `<script>` re-runs the *same* engine to make inputs live.
- **The build-time gate.** `scripts/validate-content.mjs` runs on `prebuild`: it checks
  curriculum ↔ file sync, requires sources on every lesson, and warns when a yearly tax figure has
  gone stale (see [docs/ANNUAL-REVIEW.md](docs/ANNUAL-REVIEW.md)).
- **Progress** is stored in `localStorage` only — nothing leaves the browser.

Deploy target: the site will live under the Toya domain (as a subpath) — **deploy pending**, no final
URL yet. Being static, it hosts anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

## Contributing

Fixes and lessons are welcome — a typo fix, a sharper explanation, or a whole new lesson. Start with
[CONTRIBUTING.md](CONTRIBUTING.md) and copy [docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md).

A few non-negotiables to know before you write:

- **Education-first, not promotion.** No CTAs, affiliate links, or product pitches.
- **US-only**, for total beginners. Plain language, zero jargon, zero shame — define every term the
  first time it appears.
- **Beginner general finance, not an investing course.** Investing is one phase, kept light and late.
- **Cite authoritative sources** for every factual number (the whitelist is in CONTRIBUTING.md), and
  set a `lastReviewed` date.
- **Not financial advice** — general education only.

## Project docs

- **[CLAUDE.md](CLAUDE.md)** — the master operating doc (rules, architecture, how to add a lesson).
- **[docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md)** — copy this to write a new lesson.
- **[docs/CALCULATORS.md](docs/CALCULATORS.md)** — the binding contract for every calculator.
- **[docs/ANNUAL-REVIEW.md](docs/ANNUAL-REVIEW.md)** — the yearly re-verification of tax figures.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to help.

## License

Code: [MIT](LICENSE). Course content (lessons and text): **CC BY-SA 4.0** — share and adapt with
attribution, under the same license. See [LICENSE](LICENSE) for the full split.

Built by the team at [Toya](https://usetoya.com) and contributors.
