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
calculators. **Click a phase to expand its lessons** — every link opens that lesson's source file.
The machine-readable outline lives in [`src/data/curriculum.ts`](src/data/curriculum.ts).

### Track 1 — Foundations
*Start here — money from your first paycheck.*

<details>
<summary><strong>Phase 1 — How Money Works</strong> (6 lessons)</summary>

- [1.1 — What this course is (and isn't)](src/content/lessons/1-1-what-this-course-is.md)
- [1.2 — Why money feels confusing — and why it's not your fault](src/content/lessons/1-2-why-money-feels-confusing.md)
- [1.3 — Needs, wants, and the cost of "later"](src/content/lessons/1-3-needs-wants-and-the-cost-of-later.md)
- [1.4 — Setting a money goal you'll actually hit](src/content/lessons/1-4-setting-a-money-goal.md)
- [1.5 — The 5 money moves that matter most](src/content/lessons/1-5-the-5-money-moves.md)
- [1.6 — Your money snapshot: where am I right now?](src/content/lessons/1-6-your-money-snapshot.md)

</details>

<details>
<summary><strong>Phase 2 — Your Paycheck & First Taxes</strong> (7 lessons)</summary>

- [2.1 — Gross vs. net: why your paycheck is smaller than your salary](src/content/lessons/2-1-gross-vs-net.md)
- [2.2 — Reading a pay stub, line by line](src/content/lessons/2-2-reading-a-pay-stub.md)
- [2.3 — FICA, Social Security & Medicare — what's actually taken out](src/content/lessons/2-3-fica-social-security-medicare.md)
- [2.4 — The W-4: telling your employer how much tax to hold back](src/content/lessons/2-4-the-w-4.md)
- [2.5 — W-2 vs. 1099 — which one are you?](src/content/lessons/2-5-w-2-vs-1099.md)
- [2.6 — Your first tax return, demystified](src/content/lessons/2-6-your-first-tax-return.md)
- [2.7 — Why a big refund isn't the win it feels like](src/content/lessons/2-7-why-a-big-refund-isnt-a-win.md)

</details>

<details>
<summary><strong>Phase 3 — Banking Without Getting Robbed (by fees)</strong> (6 lessons)</summary>

- [3.1 — Checking vs. savings — what each is for](src/content/lessons/3-1-checking-vs-savings.md)
- [3.2 — The account fees quietly draining you](src/content/lessons/3-2-the-account-fees-draining-you.md)
- [3.3 — High-yield savings: same money, more of it](src/content/lessons/3-3-high-yield-savings.md)
- [3.4 — Debit vs. credit — what's really happening](src/content/lessons/3-4-debit-vs-credit.md)
- [3.5 — Beating overdraft and the $35 coffee](src/content/lessons/3-5-beating-overdraft.md)
- [3.6 — Keeping your money safe (fraud, scams, 2FA)](src/content/lessons/3-6-keeping-your-money-safe.md)

</details>

<details>
<summary><strong>Phase 4 — Budgeting That Doesn't Suck</strong> (7 lessons)</summary>

- [4.1 — Where did my money go? (tracking, painlessly)](src/content/lessons/4-1-where-did-my-money-go.md)
- [4.2 — The 50/30/20 starting point](src/content/lessons/4-2-the-50-30-20-starting-point.md)
- [4.3 — Pay yourself first — the one habit that does the work](src/content/lessons/4-3-pay-yourself-first.md)
- [4.4 — Automating your money so willpower isn't the plan](src/content/lessons/4-4-automating-your-money.md)
- [4.5 — Sinking funds: saving for what you know is coming](src/content/lessons/4-5-sinking-funds.md)
- [4.6 — The 24-hour rule and other anti-impulse tricks](src/content/lessons/4-6-the-24-hour-rule.md)
- [4.7 — Budgeting when your income is irregular](src/content/lessons/4-7-budgeting-when-your-income-is-irregular.md)

</details>

<details>
<summary><strong>Phase 5 — Saving & Your Safety Net</strong> (5 lessons)</summary>

- [5.1 — Why an emergency fund comes before almost everything](src/content/lessons/5-1-why-an-emergency-fund-first.md)
- [5.2 — Your first $1,000 (the starter fund)](src/content/lessons/5-2-your-first-1000.md)
- [5.3 — How big should my emergency fund be?](src/content/lessons/5-3-how-big-should-it-be.md)
- [5.4 — Where to actually keep your savings](src/content/lessons/5-4-where-to-keep-your-savings.md)
- [5.5 — Saving for goals: short, medium, long](src/content/lessons/5-5-saving-for-goals.md)

</details>

<details>
<summary><strong>Phase 6 ⚙ — Interest & Compounding — The Engine</strong> (7 lessons)</summary>

- [6.1 — Interest, the simplest version: money that grows, or costs, over time](src/content/lessons/6-1-interest-the-simplest-version.md)
- [6.2 — Simple vs. compound interest — the difference that changes your life ⚙](src/content/lessons/6-2-simple-vs-compound-interest.md)
- [6.3 — Compounding, seen: how a little becomes a lot ⚙](src/content/lessons/6-3-compounding-seen.md)
- [6.4 — The Rule of 72: how fast money doubles](src/content/lessons/6-4-the-rule-of-72.md)
- [6.5 — APR vs. APY — why the same "rate" isn't the same number ⚙](src/content/lessons/6-5-apr-vs-apy.md)
- [6.6 — Fixed vs. variable rates — what changes, and when it bites](src/content/lessons/6-6-fixed-vs-variable-rates.md)
- [6.7 — The two faces of compounding: friend when saving, enemy in debt](src/content/lessons/6-7-the-two-faces-of-compounding.md)

</details>

<details>
<summary><strong>Phase 7 ⚙ — Credit, Decoded</strong> (11 lessons)</summary>

- [7.1 — What credit even is — and why it matters](src/content/lessons/7-1-what-credit-is.md)
- [7.2 — How a credit card actually works (statement, balance, due date) ⚙](src/content/lessons/7-2-how-a-credit-card-works.md)
- [7.3 — The grace period — how to borrow for free (if you do it right) ⚙](src/content/lessons/7-3-the-grace-period.md)
- [7.4 — How card interest is calculated (APR → daily rate → average daily balance) ⚙](src/content/lessons/7-4-how-card-interest-is-calculated.md)
- [7.5 — The minimum-payment trap — how it's calculated and why it keeps you paying ⚙](src/content/lessons/7-5-the-minimum-payment-trap.md)
- [7.6 — Fees, cash advances & penalty APR — the expensive fine print](src/content/lessons/7-6-fees-cash-advances-penalty-apr.md)
- [7.7 — Your credit score: what actually moves it](src/content/lessons/7-7-your-credit-score.md)
- [7.8 — How to build credit from zero](src/content/lessons/7-8-how-to-build-credit-from-zero.md)
- [7.9 — Using a credit card without getting burned](src/content/lessons/7-9-using-a-card-without-getting-burned.md)
- [7.10 — Buy Now, Pay Later (Klarna, Afterpay) — how it really works ⚙](src/content/lessons/7-10-buy-now-pay-later.md)
- [7.11 — Checking your credit report (free) and fixing errors](src/content/lessons/7-11-checking-your-credit-report.md)

</details>

### Track 2 — Real-Life Money
*Debt, big decisions, and building.*

<details>
<summary><strong>Phase 8 ⚙ — Getting Out of Debt (+ How Loans Work)</strong> (12 lessons)</summary>

- [8.1 — The types of debt, and how each works (revolving vs. installment, secured vs. unsecured) ⚙](src/content/lessons/8-1-types-of-debt.md)
- [8.2 — How a loan actually works: principal, interest, term ⚙](src/content/lessons/8-2-how-a-loan-works.md)
- [8.3 — Amortization — why your early payments are almost all interest ⚙](src/content/lessons/8-3-amortization.md)
- [8.4 — Good debt, bad debt, and the line between](src/content/lessons/8-4-good-debt-bad-debt.md)
- [8.5 — Why minimum payments cost so much (the 17-year problem) ⚙](src/content/lessons/8-5-the-17-year-problem.md)
- [8.6 — Avalanche vs. snowball — two ways to pay it down](src/content/lessons/8-6-avalanche-vs-snowball.md)
- [8.7 — Why extra payments crush a loan — and where to aim them ⚙](src/content/lessons/8-7-why-extra-payments-crush-a-loan.md)
- [8.8 — Putting every debt in one place (your payoff picture)](src/content/lessons/8-8-putting-every-debt-in-one-place.md)
- [8.9 — Should I consolidate or refinance?](src/content/lessons/8-9-consolidate-or-refinance.md)
- [8.10 — Payday loans & predatory debt — what to avoid and why](src/content/lessons/8-10-payday-loans-and-predatory-debt.md)
- [8.11 — Dealing with debt in collections](src/content/lessons/8-11-debt-in-collections.md)
- [8.12 — Staying out of debt for good](src/content/lessons/8-12-staying-out-of-debt.md)

</details>

<details>
<summary><strong>Phase 9 ⚙ — Student Loans (US)</strong> (5 lessons)</summary>

- [9.1 — Federal vs. private — know what you have](src/content/lessons/9-1-federal-vs-private.md)
- [9.2 — How student loan interest works (and capitalization) ⚙](src/content/lessons/9-2-how-student-loan-interest-works.md)
- [9.3 — Repayment plans, explained (income-driven & standard)](src/content/lessons/9-3-repayment-plans-explained.md)
- [9.4 — Forgiveness programs (PSLF and friends)](src/content/lessons/9-4-forgiveness-programs.md)
- [9.5 — Should you refinance your student loans?](src/content/lessons/9-5-should-you-refinance-student-loans.md)

</details>

<details>
<summary><strong>Phase 10 — Free Money at Work (Benefits)</strong> (5 lessons)</summary>

- [10.1 — Your benefits packet, decoded](src/content/lessons/10-1-your-benefits-packet-decoded.md)
- [10.2 — The 401(k) match — don't leave free money behind](src/content/lessons/10-2-the-401k-match.md)
- [10.3 — Roth vs. traditional, in plain English](src/content/lessons/10-3-roth-vs-traditional.md)
- [10.4 — HSAs and FSAs — the accounts nobody explains](src/content/lessons/10-4-hsas-and-fsas.md)
- [10.5 — Open enrollment without the panic](src/content/lessons/10-5-open-enrollment-without-the-panic.md)

</details>

<details>
<summary><strong>Phase 11 — Taxes, A Bit Deeper</strong> (5 lessons)</summary>

- [11.1 — Deductions vs. credits — and which beat which](src/content/lessons/11-1-deductions-vs-credits.md)
- [11.2 — The standard deduction and when to itemize](src/content/lessons/11-2-standard-deduction-and-itemizing.md)
- [11.3 — Side income & 1099s — what you owe](src/content/lessons/11-3-side-income-and-1099s.md)
- [11.4 — Tax-advantaged accounts recap — how to legally pay less](src/content/lessons/11-4-tax-advantaged-accounts-recap.md)
- [11.5 — When to DIY vs. get a pro](src/content/lessons/11-5-diy-vs-pro.md)

</details>

<details>
<summary><strong>Phase 12 — Protecting Yourself (Insurance & Risk)</strong> (5 lessons)</summary>

- [12.1 — What insurance is really for](src/content/lessons/12-1-what-insurance-is-really-for.md)
- [12.2 — Health insurance basics (premium, deductible, out-of-pocket)](src/content/lessons/12-2-health-insurance-basics.md)
- [12.3 — Renters & auto insurance — cheap protection you skip](src/content/lessons/12-3-renters-and-auto-insurance.md)
- [12.4 — Do I need life insurance yet?](src/content/lessons/12-4-do-i-need-life-insurance-yet.md)
- [12.5 — Identity theft and your financial safety](src/content/lessons/12-5-identity-theft-and-financial-safety.md)

</details>

<details>
<summary><strong>Phase 13 — Big Money Decisions</strong> (5 lessons)</summary>

- [13.1 — Renting: leases, deposits, roommates](src/content/lessons/13-1-renting-leases-deposits-roommates.md)
- [13.2 — Buying a car without overpaying](src/content/lessons/13-2-buying-a-car-without-overpaying.md)
- [13.3 — Moving out / moving cities, money-wise](src/content/lessons/13-3-moving-out-money-wise.md)
- [13.4 — The home-buying conversation (someday, not scary)](src/content/lessons/13-4-the-home-buying-conversation.md)
- [13.5 — Big purchases: how to decide](src/content/lessons/13-5-big-purchases-how-to-decide.md)

</details>

<details>
<summary><strong>Phase 14 — Growing Your Money</strong> (6 lessons)</summary>

- [14.1 — Why investing matters (compounding, now working for you)](src/content/lessons/14-1-why-investing-matters.md)
- [14.2 — Risk, time, and why beginners overthink it](src/content/lessons/14-2-risk-time-and-overthinking.md)
- [14.3 — Index funds: the boring answer that works](src/content/lessons/14-3-index-funds.md)
- [14.4 — Retirement accounts recap (401k, IRA, Roth)](src/content/lessons/14-4-retirement-accounts-recap.md)
- [14.5 — Your first investment, step by step](src/content/lessons/14-5-your-first-investment.md)
- [14.6 — Avoiding hype, scams, and "get rich quick"](src/content/lessons/14-6-avoiding-hype-and-scams.md)

</details>

The six calculators — **compound interest**, **APR ↔ APY**, **card interest** (average daily
balance), the **minimum-payment trap**, loan **amortization**, and **avalanche-vs-snowball payoff** —
all reuse the same integer-cents engine. See [docs/CALCULATORS.md](docs/CALCULATORS.md) for the math
and the pinned golden figures.

## How to take the course

No setup, no install — the course is designed to be read.

- **Right here on GitHub.** Start at
  [lesson 1.1 — What this course is (and isn't)](src/content/lessons/1-1-what-this-course-is.md) and
  follow the **next →** link at the bottom of every lesson. Or jump anywhere from the
  [curriculum index](#curriculum) above.
- **On the website** — the hosted version (with the live, interactive calculators) is coming soon
  under the [Toya](https://usetoya.com) domain; the link will land here when it's up.
- Prefer offline? Clone the repo and read the same markdown files in any editor:
  `git clone https://github.com/debtzero-club/learn-personal-finance-from-scratch.git`

Want to run or build the site itself (contributors)? See
[CONTRIBUTING.md](CONTRIBUTING.md) — dev setup is three commands.

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

- **[docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md)** — copy this to write a new lesson.
- **[docs/CALCULATORS.md](docs/CALCULATORS.md)** — the binding contract for every calculator.
- **[docs/ANNUAL-REVIEW.md](docs/ANNUAL-REVIEW.md)** — the yearly re-verification of tax figures.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to help.

## License

Code: [MIT](LICENSE). Course content (lessons and text): **CC BY-SA 4.0** — share and adapt with
attribution, under the same license. See [LICENSE](LICENSE) for the full split.

Built by the team at [Toya](https://usetoya.com) and contributors.
