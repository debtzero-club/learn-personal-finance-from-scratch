// amortization.ts — the fixed-payment loan-amortization engine (CALC-05).
//
// This powers the "payment split" split-bar (lessons 8.2/8.3 — early payments are mostly
// interest), Buy-Now-Pay-Later "pay in 4" (lesson 7.10, the 0%-APR branch), and the
// "extra payments crush a loan" demo (lesson 8.7, the optional extra-payment field).
// Like compound.ts it is PURE and framework-free — NO DOM, NO Astro imports — so it stays
// golden-testable and runs identically at build time, in the browser, and in Vitest.
//
// THE RULE (D-14): money is ALWAYS integer cents, routed through money.ts. NEVER do float
// multiplication on a balance — binary-float error compounds across periods and silently
// corrupts results. The ONLY float here is the dimensionless payment factor (1+r)^n: that
// is a RATE calculation (like apr.ts's **), and a rate is never money. Only the resulting
// PAYMENT is rounded to whole cents (via toCents, half-up).
//
// Locked conventions (CALCULATORS.md §1 + CONTEXT D-05/D-06/D-07):
//   r = apr / 12 (period rate, a float); interest posts per period via mulRate(bal, r)
//   half-up to whole cents, BEFORE the payment is applied; round per period, not at the end.
//
// THE THREE GUARDED BEHAVIORS (each a research Pitfall, pinned by goldens):
//   • Fixed payment M = P·r(1+r)^n / ((1+r)^n − 1), r = apr/12, n = months.
//   • 0%-APR branch (D-07): payment = principal ÷ term, no interest (BNPL "pay in 4").
//   • Pitfall 3 — final-payment reconciliation: the closed-form payment is rounded to whole
//     cents, so round-per-period accrual doesn't perfectly hit $0.00 over n payments. On the
//     LAST SCHEDULED period (no-extra case: m === months) the payment is set to the exact
//     remaining balance + its interest, so the schedule closes on EXACTLY $0.00 in `months`
//     rows — NOT a phantom 61st payment. With an extra payment the loan finishes EARLY;
//     whichever period clears the balance reconciles to $0.00.

import { type Cents, mulRate, add, sub, toCents, fromCents } from '../lib/money';

export interface AmortizeParams {
  /** Loan principal, in integer cents. */
  principal: Cents;
  /** Nominal annual rate (APR) as a decimal, e.g. 0.07 for 7%. 0 → the BNPL branch. */
  apr: number;
  /** Scheduled term, in months. */
  months: number;
  /** Optional extra payment added each month, in cents (end-of-period); finishes early. */
  extra?: Cents;
}

export interface AmortRow {
  /** 1-based payment index. */
  m: number;
  /** Interest portion of this payment, in cents (round per period, half-up). */
  interest: Cents;
  /** Principal portion of this payment, in cents (pay − interest). */
  principalPaid: Cents;
  /** Total payment this period, in cents (payment + extra, capped/reconciled to clear). */
  pay: Cents;
  /** End-of-period remaining balance, in cents. */
  balance: Cents;
}

export interface AmortResult {
  /** The fixed monthly payment, in cents (closed-form, rounded half-up). */
  payment: Cents;
  /** Actual number of payments made (=== `months` for the no-extra case; fewer with extra). */
  months: number;
  /** Total interest paid over the whole schedule, in cents. */
  totalInterest: Cents;
  /** Per-period rows — the contract shared by goldens, the static table, and the split-bar. */
  rows: AmortRow[];
  /** Remaining balance after the last payment, in cents (always 0 for a valid loan). */
  finalBalance: Cents;
}

const ZERO = 0 as Cents;

/**
 * Build a fixed-payment amortization schedule. Pure integer-cents math via money.ts; the
 * only float is the dimensionless (1+r)^n payment factor. Branches the 0%-APR case and
 * reconciles the final payment to exactly $0.00 within `months` rows (Pitfall 3 — no
 * phantom final period). An optional `extra` finishes the loan early.
 */
export function amortize(p: AmortizeParams): AmortResult {
  const r = p.apr / 12; // period rate — a float; rates are never money
  const extra: Cents = p.extra ?? ZERO;

  // The fixed payment. The (1+r)^n factor is a pure float (a rate, like apr.ts's **); only
  // the resulting dollar payment becomes money via toCents (half-up). 0% → principal ÷ term.
  const payment: Cents =
    p.apr === 0
      ? toCents(fromCents(p.principal) / p.months)
      : (() => {
          const factor = (1 + r) ** p.months;
          return toCents((fromCents(p.principal) * r * factor) / (factor - 1));
        })();

  let bal: Cents = p.principal;
  let totalInterest: Cents = ZERO;
  const rows: AmortRow[] = [];

  // Guard the loop generously; correctness comes from the reconcile step, not the guard.
  for (let m = 1; bal > 0 && m < p.months + 600; m++) {
    // Interest posts first, round per period half-up (0% → no interest).
    const interest: Cents = p.apr === 0 ? ZERO : mulRate(bal, r);

    let pay: Cents = add(payment, extra);
    if (pay >= add(bal, interest)) {
      // This payment clears the loan → reconcile to exactly $0.00.
      pay = add(bal, interest);
    } else if (extra === ZERO && m === p.months) {
      // ⚠️ Last SCHEDULED period (no extra): absorb accumulated per-period rounding so the
      // balance lands on exactly $0.00 in `months` rows — NOT a phantom 61st (Pitfall 3).
      pay = add(bal, interest);
    }

    const principalPaid: Cents = sub(pay, interest);
    bal = sub(bal, principalPaid);
    totalInterest = add(totalInterest, interest);
    rows.push({ m, interest, principalPaid, pay, balance: bal });
  }

  return { payment, months: rows.length, totalInterest, rows, finalBalance: bal };
}
