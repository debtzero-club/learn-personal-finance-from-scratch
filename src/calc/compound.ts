// compound.ts — the cornerstone compound-interest engine (CALC-01).
//
// This is the single most-reused piece of code in the project: every later
// calculator (credit Phase 7, debt/amortization Phase 8, student loans Phase 9,
// investing Phase 14) imports it or copies its conventions. It is PURE and
// framework-free — NO DOM, NO Astro imports — so it stays golden-testable and can
// run identically at build time, in the browser, and in Vitest.
//
// THE RULE (D-17): money is ALWAYS integer cents, routed through money.ts. NEVER
// do float multiplication on a balance (the naive `balance times one-plus-rate`)
// — binary-float error compounds across periods and silently corrupts results.
// Only the RATE (annualRate / periodsPerYear) is a float; it is never money.
//
// Conventions are LOCKED in docs/CALCULATORS.md and obeyed by every downstream
// calculator:
//   D-08  frequency param (annual | monthly | daily); teaching default = monthly
//   D-09  contribution timing = end-of-period (ordinary annuity): interest posts
//         BEFORE the contribution is added, so the final contribution earns no
//         interest in its final period
//   D-10  rounding cadence = round per period to whole cents via money.ts mulRate
//         (half-up), like a real account statement — NOT round-at-the-end
//
// The per-period recurrence, in this exact order:
//   interest = mulRate(balance, periodRate);   // half-up to whole cents (D-10)
//   balance  = add(balance, interest);
//   balance  = add(balance, contribution);      // end-of-period (D-09)

import { type Cents, mulRate, add } from '../lib/money';

/** Compounding frequency. Teaching default is monthly (D-08). */
export type Frequency = 'annual' | 'monthly' | 'daily';

/** Periods per year for each frequency. The loop period == the compounding period. */
const PERIODS: Record<Frequency, number> = { annual: 1, monthly: 12, daily: 365 };

export interface CompoundParams {
  /** Starting amount, in integer cents. */
  principal: Cents;
  /** Amount added each period, in integer cents (end-of-period, D-09). */
  contribution: Cents;
  /** Nominal annual rate (APR) as a decimal, e.g. 0.05 for 5%. */
  annualRate: number;
  /** Number of years to project. */
  years: number;
  /** Compounding frequency; default 'monthly' (D-08). */
  frequency?: Frequency;
}

export interface PeriodRow {
  /** 1-based period index. */
  period: number;
  /** Cumulative contributions so far, in cents (EXCLUDES principal). */
  contributed: Cents;
  /** Interest posted THIS period, in cents (rounded per period, D-10). */
  interest: Cents;
  /** Cumulative interest to date, in cents. */
  interestToDate: Cents;
  /** End-of-period balance, in cents. */
  balance: Cents;
}

export interface Schedule {
  /** Per-period rows — the contract shared by goldens, the static table, and the visual. */
  rows: PeriodRow[];
  /** End balance after the last period, in cents. */
  finalBalance: Cents;
  /** Principal + all contributions, in cents. */
  totalContributed: Cents;
  /** Total interest earned over the whole projection, in cents. */
  totalInterest: Cents;
}

const ZERO = 0 as Cents;

/**
 * Project a compound-interest schedule. Pure integer-cents math routed through
 * money.ts; rates are floats. Returns the full per-period schedule plus summary.
 */
export function compound(p: CompoundParams): Schedule {
  const n = PERIODS[p.frequency ?? 'monthly'];
  const periodRate = p.annualRate / n; // rates are floats; money is cents
  const totalPeriods = Math.round(p.years * n);

  let balance: Cents = p.principal;
  let contributedToDate: Cents = ZERO;
  let interestToDate: Cents = ZERO;
  const rows: PeriodRow[] = [];

  for (let period = 1; period <= totalPeriods; period++) {
    // D-09 end-of-period, D-10 round-per-period — this exact order:
    const interest = mulRate(balance, periodRate); // half-up whole cents
    balance = add(balance, interest);
    balance = add(balance, p.contribution);

    interestToDate = add(interestToDate, interest);
    contributedToDate = add(contributedToDate, p.contribution);

    rows.push({
      period,
      contributed: contributedToDate,
      interest,
      interestToDate,
      balance,
    });
  }

  return {
    rows,
    finalBalance: balance,
    totalContributed: add(p.principal, contributedToDate),
    totalInterest: interestToDate,
  };
}
