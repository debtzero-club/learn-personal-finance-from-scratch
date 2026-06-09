# Annual Review — re-verifying `src/data/numbers.ts`

> This is the committed yearly checklist for keeping `src/data/numbers.ts` accurate.
> Every figure the course quotes (tax brackets, the FICA wage base, contribution limits)
> changes year-to-year, so once a year someone re-verifies each one against its
> authoritative IRS/SSA source and bumps it forward. Doing this keeps the lessons
> trustworthy — accuracy + sourcing is a project non-negotiable (see `../CLAUDE.md`).

---

## When to run this

**Run it around October–November each year**, when the IRS (via a Revenue Procedure /
Notice) and the SSA publish the **next** tax year's figures:

- IRS inflation adjustments (brackets, standard deduction) — usually **late October**.
- IRS retirement contribution limits (401(k), IRA) — usually **early November**.
- SSA Social Security wage base for the next year — usually **mid-October**.
- IRS HSA limits (Rev. Proc.) — published **earlier**, around **May** of the prior year.

Before those publish, it is normal and expected that `numbers.ts` still holds the current
tax year's figures. The validator's stale-year **WARN** (see below) is non-blocking on
purpose so a January build never breaks while you wait for the new numbers.

## How this ties to the validator

`scripts/validate-content.mjs` (run automatically on every `npm run build` via the
`prebuild` lifecycle, and standalone via `npm run validate`) audits every figure in
`numbers.ts`:

- **HARD-FAIL (build aborts)** if any figure loses its `taxYear` or `source`. Those are
  correctness fields — a figure without provenance is a bug.
- **WARN only (build still succeeds, exit 0)** when a figure's `taxYear` is **less than the
  current calendar year**. This is the nudge that it's time to run this checklist.

Bumping a figure's `value` + `taxYear` (+ `source` if the URL changed) clears its warning.

## Update procedure (per figure)

1. Open the figure's authoritative source (URLs in the table below) and read the new value.
2. Edit `src/data/numbers.ts`:
   - **Money** figures are stored as **integer cents** (e.g. `$184,500` → `18450000`).
   - **Rates** are stored as **plain decimals** (e.g. `6.2%` → `0.062`) — never as cents.
   - Bump `taxYear` to the new year.
   - Update `source` only if the URL changed (the `SRC_*` constants at the top of the file).
3. Run `npm run validate && npm test` and confirm both are green (the validator clears the
   stale warning; the Vitest spot-value tests confirm the new numbers parse correctly).
4. Update the file header comment's "verified on" date and commit.

---

## Checklist — every figure group in `numbers.ts`

"Indexed yearly?" = does the IRS/SSA adjust it for inflation each year. **YES** means
re-verify and bump it every year. **NO (statutory)** figures are set by law and rarely
change — verify they're still current, but do **not** churn them every year.

| Figure (`numbers.ts` key) | TY2026 value | Source | Indexed yearly? |
| --- | --- | --- | --- |
| Federal income-tax brackets, Single (`federalIncomeTaxBrackets.single`) | 10–37% bands | IRS Rev. Proc. (inflation adjustments) | **YES — re-verify** |
| Federal income-tax brackets, MFJ (`federalIncomeTaxBrackets.marriedFilingJointly`) | 10–37% bands | IRS Rev. Proc. (inflation adjustments) | **YES — re-verify** |
| Standard deduction, Single (`standardDeductionSingle`) | $16,100 | IRS Rev. Proc. (inflation adjustments) | **YES — re-verify** |
| Standard deduction, MFJ (`standardDeductionMFJ`) | $32,200 | IRS Rev. Proc. (inflation adjustments) | **YES — re-verify** |
| Social Security wage base (`socialSecurityWageBase`) | $184,500 | SSA / IRS Topic 751 | **YES — re-verify** |
| Social Security employee rate (`socialSecurityEmployeeRate`) | 6.2% | IRS Topic 751 | **NO (statutory) — verify, rarely changes** |
| Medicare employee rate (`medicareEmployeeRate`) | 1.45% | IRS Topic 751 | **NO (statutory) — verify, rarely changes** |
| Additional Medicare rate (`additionalMedicareRate`) | 0.9% | IRS Topic 751 | **NO (statutory) — verify, rarely changes** |
| Additional Medicare threshold, Single (`additionalMedicareThresholdSingle`) | $200,000 | IRS Additional Medicare Tax Q&A | **NO — NOT indexed; do not bump every year** |
| Additional Medicare threshold, MFJ (`additionalMedicareThresholdMFJ`) | $250,000 | IRS Additional Medicare Tax Q&A | **NO — NOT indexed; do not bump every year** |
| 401(k) elective-deferral limit (`contributionLimit401k`) | $24,500 | IRS Notice (retirement limits) | **YES — re-verify** |
| IRA contribution limit (`iraContributionLimit`) | $7,500 | IRS Notice (retirement limits) | **YES — re-verify** |
| HSA contribution limit, self-only (`hsaContributionLimitSelfOnly`) | $4,400 | IRS Rev. Proc. (HSA limits) | **YES — re-verify** |
| HSA contribution limit, family (`hsaContributionLimitFamily`) | $8,750 | IRS Rev. Proc. (HSA limits) | **YES — re-verify** |

> **The statutory non-indexed figures deserve special care.** The Social Security 6.2% and
> Medicare 1.45% rates, the 0.9% Additional Medicare rate, and especially the **$200,000 /
> $250,000 Additional Medicare thresholds are set by statute and are NOT inflation-indexed.**
> They have not changed in over a decade. Verify they're still current, but **do not bump
> their `taxYear` mechanically each year** — doing so would falsely imply they were
> re-confirmed for a new figure when nothing changed. (A future enhancement could exempt
> non-indexed figures from the stale-year warning; for now, treat their warning as
> informational.)

---

## Authoritative source URLs

Copy these straight into a future review so nobody has to re-find them. These are the exact
URLs referenced by the `SRC_*` constants in `src/data/numbers.ts`. **Only IRS / SSA / CFPB /
Federal Reserve / FINRA Foundation sources are acceptable** (project rule).

| Group | Source URL |
| --- | --- |
| Federal income-tax brackets + standard deduction (TY2026, OBBBA-amended) | <https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill> |
| FICA — Social Security & Medicare rates + SS wage base | <https://www.irs.gov/taxtopics/tc751> |
| Additional Medicare Tax thresholds ($200k / $250k, NOT indexed) | <https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax> |
| 401(k) + IRA contribution limits (Notice 2025-67 for TY2026) | <https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500> |
| HSA contribution limits (Rev. Proc. 2025-19 for TY2026) | <https://www.irs.gov/pub/irs-drop/rp-25-19.pdf> |
| Cross-check for full bracket ranges (secondary) | <https://taxfoundation.org/data/all/federal/2026-tax-brackets/> |

> When the IRS posts the **next** tax year's pages, the URL pattern usually just changes the
> year (e.g. `...for-tax-year-2027...`). Update the `SRC_*` constant if the slug changes.

---

## One-line summary

Each October–November, re-verify every **indexed** figure above against its IRS/SSA source,
bump its `value` + `taxYear` in `src/data/numbers.ts`, leave the **statutory non-indexed**
rates and thresholds alone unless the law actually changed, then run
`npm run validate && npm test` to confirm green.
