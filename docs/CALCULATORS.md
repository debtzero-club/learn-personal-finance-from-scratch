# CALCULATORS.md — the binding contract for every interactive calculator

> **Read this before building any calculator. It is the binding contract.**
> The compound-interest engine (`src/calc/compound.ts`) is the cornerstone: credit
> (Phase 7), debt + amortization (Phase 8), student loans (Phase 9), and investing
> (Phase 14) all reuse the conventions locked here. Pin them once, obey them everywhere.

This doc joins `MASTER-PLAN.md`, `LESSON-TEMPLATE.md`, and `ANNUAL-REVIEW.md` as a
top-level operating doc. Its four sections are:

1. [Conventions](#1-conventions) — frequency, contribution timing, rounding cadence, rate representation
2. [APR vs APY](#2-apr-vs-apy) — the nominal↔effective formula + the worked number
3. [Embedding pattern](#3-embedding-pattern) — how a `.md` lesson mounts an interactive calculator
4. [How to add a new calculator](#4-how-to-add-a-new-calculator) — the checklist for Phase 4+

---

## 1. Conventions

All money math runs in **integer cents** through `src/lib/money.ts` (`mulRate`, `add`).
**Never** do float multiplication on a balance — binary-float error compounds across
periods and silently corrupts results. Only the *rate* is a float, and a rate is never money.

| Convention | Locked value | Why |
|------------|--------------|-----|
| **Compounding frequency** | param `annual \| monthly \| daily`; **default `monthly`** (D-08) | Matches the HYSA / savings / card-statement reality the audience actually sees. The simplest intro lesson may show an annual example for intuition. |
| **Contribution timing** | **end-of-period** (ordinary annuity) (D-09) | Money is added at the *end* of each period, *after* that period's interest posts. Simplest to explain; matches most auto-transfers. The final contribution earns no interest in its final period. |
| **Rounding cadence** | **round per period** to whole cents via `money.ts` `mulRate` (half-up) (D-10) | Interest posts as whole cents each period, like a real US account statement; the next period compounds on the posted (rounded) balance. Deterministic and golden-testable. **NOT** full-precision-then-round-at-the-end. |
| **Rate representation** | decimal (e.g. `0.05`, not `5`) | Matches the `money.ts` `mulRate(c, rate)` contract and the Phase-1 convention: rates are decimals, money is cents. |
| **Period rate** | `periodRate = annualRate / periodsPerYear` (nominal / APR) | Simple division of the nominal annual rate. The same nominal rate at a different frequency yields a different *effective* yield — that gap **is** the APR-vs-APY lesson (§2). |

### The recurrence (verbatim)

Each compounding period the engine does exactly these three integer-cents steps,
**in this order**:

```ts
interest = mulRate(balance, periodRate); // half-up to whole cents (D-10)
balance  = add(balance, interest);
balance  = add(balance, contribution);   // end-of-period (D-09)
```

where `periodRate = annualRate / periodsPerYear` (a float — rates aren't money) and
`periodsPerYear ∈ { annual: 1, monthly: 12, daily: 365 }`.

**Why round per period, not at the end.** A real US account statement posts interest
as whole cents each statement period; the next period compounds on that posted, rounded
balance. Rounding only at the end would silently diverge from what a learner sees on their
own statement, and would not reconcile against the issuer references that downstream
calculators (card interest, amortization) must match. Round-per-period is also strictly
deterministic and golden-testable — `money.ts`'s `mulRate` already does the half-up rounding
correctly (it defeats the `1.005` float trap with a `toPrecision(12)` snap), so the engine
inherits correct rounding for free.

### The engine API (`src/calc/compound.ts`)

```ts
export type Frequency = 'annual' | 'monthly' | 'daily';

export interface CompoundParams {
  principal: Cents;      // starting amount, in cents
  contribution: Cents;   // added each period (end-of-period, D-09)
  annualRate: number;    // decimal, e.g. 0.05 (nominal / APR)
  years: number;
  frequency?: Frequency; // default 'monthly' (D-08)
}
export interface PeriodRow {
  period: number;        // 1-based
  contributed: Cents;    // cumulative contributions so far (excl. principal)
  interest: Cents;       // interest posted THIS period (rounded per period, D-10)
  interestToDate: Cents; // cumulative interest
  balance: Cents;        // end-of-period balance
}
export interface Schedule {
  rows: PeriodRow[];
  finalBalance: Cents;
  totalContributed: Cents; // principal + all contributions
  totalInterest: Cents;
}
export function compound(p: CompoundParams): Schedule;
```

The **`PeriodRow` is the contract**: golden tests pin its exact cents, the build-time
island render reads `rows` for the static table + split-bars, and the live `<script>`
re-runs the same `compound()` on input change. One source of math.

### Pinned golden figures (from `src/calc/compound.test.ts`)

| Scenario | `finalBalance` | `totalInterest` | Note |
|----------|----------------|-----------------|------|
| $1,000, no contrib, 5%, **monthly**, 1 yr | `105116` ($1,051.16) | `5116` | 5.116% effective shows as ~$51.16 |
| $1,000, no contrib, 5%, **annual**, 1 yr | `105000` ($1,050.00) | `5000` | exactly $50 — annual < monthly at the same nominal rate |
| $0, $100/mo, **0%**, monthly, 1 yr | `120000` ($1,200.00) | `0` | 0%-rate edge: pure contributions, no interest |
| $1,000, $100/mo, 5%, monthly, 1 yr | `227904` ($2,279.04) | `7904` | end-of-period edge: the final $100 earns no interest |

A daily-compounding edge example: `0.05 / 365` per day. Contributions per period
semantics still hold (one contribution per compounding period) — for the beginner
monthly default, compounding period and contribution cadence coincide.

---

## 2. APR vs APY

APR and APY are **rate** conversions (dimensionless), so float `**` is correct here —
there is **no money** in this calculation. A rate only becomes money when fed (as a
balance) into `compound()`. The helper lives in `src/calc/apr.ts`.

### The locked formula (D-11)

```
APY = (1 + APR/n)^n − 1          // nominal annual rate -> effective annual yield
APR = n · ((1 + APY)^(1/n) − 1)  // the inverse
```

where `n` = compounding periods per year. This is the standard nominal↔effective
conversion, and is the equal-periods special case of the CFPB **Regulation DD
(Truth in Savings), Appendix A** general APY formula:

> `APY = 100 [(1 + Interest/Principal)^(365/Days in term) − 1]`
> — *CFPB Regulation DD, Appendix A (Annual Percentage Yield Calculation).*

### The worked number

**5% APR compounded monthly** → `(1 + 0.05/12)^12 − 1 = 0.05116190…` = **5.116190% APY**,
which displays as **5.12% APY**. The same 5% APR compounded **daily** → ~5.126750% APY.
The *same nominal rate* yields a *different* annual figure purely because of compounding
frequency — that is the entire point of lesson 6.5, and the headline the `apr-apy` island shows.

### Plain-English framing (sourced)

- **APR** is the yearly rate *before* compounding is folded in (the cost of borrowing on a
  card; APR ÷ 365 ≈ the daily periodic rate charged on a balance). *(CFPB.)*
- **APY** is the yearly rate *after* compounding, on a 365-day year (what you *earn* on
  savings). A higher APY means faster growth. *(CFPB Regulation DD, Appendix A.)*
- **Beginner takeaway:** on savings you want the APY (the honest number); on debt, the
  effective yield of what you owe is *higher* than the stated APR for the same reason.
  Same engine, two faces — this threads into lesson 6.7.

**Sources (authoritative-whitelist only):** CFPB (Regulation DD Appendix A; "loan interest
rate vs. APR"; "daily periodic rate"), Federal Reserve (Regulation DD: Truth in Savings
background). Do **not** cite any non-whitelist source for APR/APY provenance.

---

## 3. Embedding pattern

> For Wave 2 and **every** downstream calculator. Lessons stay `.md` — no MDX, no
> markdown directive, no new dependency. This mirrors how `quiz[]` already renders `<Quiz>`.

A lesson declares an interactive calculator with a single frontmatter field:

```yaml
calculator: compound   # or: apr-apy
```

**Wiring (D-01 / D-02 / D-03):**

1. **Schema** — `src/content/config.ts` adds `calculator: z.enum([...]).optional()`. The
   enum makes a typo a Zod build error for free.
2. **Registry** — `LessonLayout.astro` maps the name to a component via a small registry
   object (exactly like `quiz[]` → `<Quiz>`):
   ```astro
   ---
   import CompoundCalc from '../components/CompoundCalc.astro';
   import AprApyCalc from '../components/AprApyCalc.astro';
   const CALCULATORS = { compound: CompoundCalc, 'apr-apy': AprApyCalc };
   const Calculator = d.calculator ? CALCULATORS[d.calculator] : null;
   ---
   ```
3. **Fixed slot** — the calculator renders in a dedicated **`.lesson-calc`** section
   placed **after** the lesson body `<slot/>` and **before** the "Do it" section. Same
   position for every ⚙ lesson; the "By the numbers" prose leads into the live calculator:
   ```astro
   <div class="lesson-body"><slot /></div>
   { Calculator && <section class="lesson-calc"><Calculator /></section> }
   <section class="do-it">…</section>   <!-- now comes AFTER the .lesson-calc slot -->
   ```
4. **Validator name-check** — `scripts/validate-content.mjs` asserts the declared
   `calculator` name resolves to a registered component (mirroring the `figures[]` key
   check), so a name that isn't registered fails the build. Keep the **registry keys**, the
   **`z.enum` values**, and the **validator allow-list** as one synchronized small set.

**No-JS fallback rule (D-04 / D-05).** Progressive enhancement only. The island
**server-renders a correct default-scenario worked example at build time using the engine**
(so the printed numbers are golden-tested), then a module `<script>` imports the *same*
`src/calc/compound.ts` engine and makes the inputs live. **JS off → a correct static
example still shows.** There is exactly one source of math: the build-time render, the live
`<script>`, and the golden tests all call the same `compound()`. Never re-implement the loop
in the island. No `client:` directive — a plain `<script>` in the `.astro` file is the
established island mechanism (see `Quiz.astro`).

**Visual (D-06).** The snowball = CSS stacked / **split bars** — per-period bars split into
contributions vs accrued interest, backed by a real data table for accessibility. Build the
`.split-bar` primitive reusable: it becomes the amortization "payment split" bar (CALC-05).

---

## 4. How to add a new calculator

Checklist for Phase 4 (card interest, minimum-payment, amortization, payoff) and beyond:

1. **Write the pure engine** in `src/calc/<name>.ts` — DOM-free, Astro-free, routing every
   money step through `money.ts` (`mulRate` per period, `add`). Reuse `compound()` /
   `apr.ts` where the math is the same; copy the round-per-period, end-of-period conventions.
2. **Write RED golden tests first** in `src/calc/<name>.test.ts` — pin exact cents with
   `.toBe` (never `.toBeCloseTo` on a money value). Run the engine to capture the true
   outputs and pin them as the contract, exactly as `money.test.ts` and `compound.test.ts` do.
3. **Build the island** under `src/components/<Name>Calc.astro` — server-render the default
   scenario from the engine (no-JS fallback), then a `<script>` importing the same engine
   makes inputs live. Reuse the `.split-bar` / `.calc-field` primitives from `CompoundCalc`.
4. **Register the name in three places, kept in sync:** the `LessonLayout` registry, the
   `config.ts` `calculator` enum, and the `validate-content.mjs` allow-list. Add good/bad
   fixtures for the validator name-check.
5. **Assign it to a lesson** via the `calculator` frontmatter field; it renders in the
   `.lesson-calc` slot.

**Hard rules:** zero new dependencies; all money math integer-cents via `money.ts`; one
source of math (engine reused by render + `<script>` + tests); cite only CFPB / Federal
Reserve / IRS / SSA / FINRA Foundation.

---

*Last reviewed: 2026-06-10 · Owner: the ⚙ calculator phases (6, 7, 8, 9, 14).*
