// numbers.ts — the single dated + sourced US yearly-figures file. Tax year 2026.
//
// WHY THIS EXISTS: every figure that changes year-to-year (tax brackets, the FICA
// wage base, contribution limits) lives here exactly once, each carrying its own
// `taxYear` and an authoritative `source` URL. Phase 2 prose lessons (FICA /
// brackets) and every downstream ⚙ calculator import it read-only, and the
// annual-review staleness audit introspects `taxYear`/`source` on every leaf.
// No placeholders — all TY2026 figures below are officially published and were
// verified against IRS/SSA primary sources on 2026-06-08 (see 01-RESEARCH.md).
//
// UNIT CONVENTION (read this before adding a figure):
//   - MONEY figures are stored as INTEGER CENTS (e.g. $184,500 -> 18450000) so
//     they compose directly with src/lib/money.ts (which is integer-cents only).
//     This includes the SS wage base, contribution limits, Additional-Medicare
//     thresholds, standard deductions, AND every tax-bracket `min`/`max`.
//   - RATES are stored as PLAIN DECIMALS (e.g. 6.2% -> 0.062). They are NOT money
//     and must NOT be routed through money.ts.
//   - The top tax bracket has `max: null` (no upper bound).
//
// SHAPE: every leaf is `{ value, taxYear, source }`. The staleness audit only
// reads `taxYear` and `source`; the unit (cents vs decimal) is documented per
// figure here, by its key name and the inline comment.
//
// IMPORTANT: this file uses only `interface` / `type` / plain objects / `as const`.
// It deliberately avoids `enum` and `namespace`: the content-sync validator
// native-imports this module under Node 24 type-stripping, which strips type
// annotations but does NOT down-level enums/namespaces (see 01-RESEARCH.md
// Pitfall 2). Keep new entries enum-free.

/** A single self-describing figure: a value plus its tax year and source URL. */
export interface Figure {
  /** Integer CENTS for money figures; a plain DECIMAL for rates. */
  readonly value: number;
  /** The tax year this figure applies to. */
  readonly taxYear: number;
  /** Authoritative source URL (IRS / SSA). Must start with `https://`. */
  readonly source: string;
}

/** One row of a progressive tax-bracket table. `min`/`max` are integer cents. */
export interface BracketFigure {
  /** Marginal rate as a plain decimal (e.g. 0.22 for 22%). */
  readonly rate: number;
  /** Lower bound of taxable income for this bracket, in integer cents (inclusive). */
  readonly min: number;
  /** Upper bound in integer cents (inclusive), or `null` for the top bracket. */
  readonly max: number | null;
  readonly taxYear: number;
  readonly source: string;
}

// Authoritative source URLs (one place, referenced below) ------------------

/** IRS Topic 751 — Social Security & Medicare withholding rates + SS wage base. */
const SRC_FICA = 'https://www.irs.gov/taxtopics/tc751';

/** IRS Q&A — Additional Medicare Tax thresholds ($200k single / $250k MFJ; NOT indexed). */
const SRC_ADDL_MEDICARE =
  'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax';

/** IRS newsroom — 401(k) limit $24,500 / IRA limit $7,500 for 2026 (Notice 2025-67). */
const SRC_RETIREMENT =
  'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500';

/** IRS Rev. Proc. 2025-19 — HSA contribution limits for 2026. */
const SRC_HSA = 'https://www.irs.gov/pub/irs-drop/rp-25-19.pdf';

/** IRS newsroom — TY2026 tax inflation adjustments (OBBBA-amended), incl. brackets + standard deduction. */
const SRC_BRACKETS =
  'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill';

// TY2026 figures -----------------------------------------------------------

export const NUMBERS = {
  // --- FICA (Social Security + Medicare) ---------------------------------
  /** Social Security taxable maximum ("wage base") — $184,500. Indexed annually. */
  socialSecurityWageBase: { value: 18450000, taxYear: 2026, source: SRC_FICA },
  /** Social Security employee rate — 6.2%. Statutory (not indexed). */
  socialSecurityEmployeeRate: { value: 0.062, taxYear: 2026, source: SRC_FICA },
  /** Medicare employee rate — 1.45%. Statutory (not indexed). */
  medicareEmployeeRate: { value: 0.0145, taxYear: 2026, source: SRC_FICA },
  /** Additional Medicare rate — 0.9% on wages above the threshold. Statutory (not indexed). */
  additionalMedicareRate: { value: 0.009, taxYear: 2026, source: SRC_FICA },
  /** Additional Medicare threshold (Single) — $200,000. NOT inflation-indexed; rarely changes. */
  additionalMedicareThresholdSingle: { value: 20000000, taxYear: 2026, source: SRC_ADDL_MEDICARE },
  /** Additional Medicare threshold (MFJ) — $250,000. NOT inflation-indexed; rarely changes. */
  additionalMedicareThresholdMFJ: { value: 25000000, taxYear: 2026, source: SRC_ADDL_MEDICARE },

  // --- Retirement & HSA contribution limits -----------------------------
  /** 401(k) elective-deferral limit — $24,500. */
  contributionLimit401k: { value: 2450000, taxYear: 2026, source: SRC_RETIREMENT },
  /** IRA contribution limit — $7,500. */
  iraContributionLimit: { value: 750000, taxYear: 2026, source: SRC_RETIREMENT },
  /** HSA contribution limit, self-only coverage — $4,400. */
  hsaContributionLimitSelfOnly: { value: 440000, taxYear: 2026, source: SRC_HSA },
  /** HSA contribution limit, family coverage — $8,750. */
  hsaContributionLimitFamily: { value: 875000, taxYear: 2026, source: SRC_HSA },

  // --- Standard deduction -----------------------------------------------
  /** Standard deduction (Single) — $16,100. */
  standardDeductionSingle: { value: 1610000, taxYear: 2026, source: SRC_BRACKETS },
  /** Standard deduction (MFJ) — $32,200. */
  standardDeductionMFJ: { value: 3220000, taxYear: 2026, source: SRC_BRACKETS },

  // --- Federal income-tax brackets (Single + MFJ) -----------------------
  // Ordered low rate -> high. `min`/`max` are integer cents (taxable income).
  // The top bracket has `max: null`. Single + MFJ only for v1 (HoH/MFS deferred).
  federalIncomeTaxBrackets: {
    single: [
      { rate: 0.10, min: 0, max: 1240000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.12, min: 1240001, max: 5040000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.22, min: 5040001, max: 10570000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.24, min: 10570001, max: 20177500, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.32, min: 20177501, max: 25622500, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.35, min: 25622501, max: 64060000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.37, min: 64060001, max: null, taxYear: 2026, source: SRC_BRACKETS },
    ],
    marriedFilingJointly: [
      { rate: 0.10, min: 0, max: 2480000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.12, min: 2480001, max: 10080000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.22, min: 10080001, max: 21140000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.24, min: 21140001, max: 40355000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.32, min: 40355001, max: 51245000, taxYear: 2026, source: SRC_BRACKETS },
      // Top MFJ threshold is $768,700 (76870000 cents), per the authoritative IRS
      // page — NOT the $768,600 a secondary web snippet showed.
      { rate: 0.35, min: 51245001, max: 76870000, taxYear: 2026, source: SRC_BRACKETS },
      { rate: 0.37, min: 76870001, max: null, taxYear: 2026, source: SRC_BRACKETS },
    ],
  },
} as const;

/** Read-only view of the figure registry. */
export type Numbers = typeof NUMBERS;
