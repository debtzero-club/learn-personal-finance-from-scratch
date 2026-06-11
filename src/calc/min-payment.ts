// min-payment.ts — the minimum-payment-trap engine (CALC-04).
//
// This engine answers the most expensive question on a credit card: "if I only ever
// pay the minimum, how long — and how much — does it actually take?" It powers lessons
// 7.5 (the minimum-payment trap) and 8.5 (the verified payoff horizon). PURE and
// framework-free — NO DOM, NO Astro imports — so it stays golden-testable and runs
// identically at build time, in the browser, and in Vitest. Shares the round-per-period
// cadence of compound.ts.
//
// THE RULE (docs/CALCULATORS.md §1): money is ALWAYS integer cents, routed through
// money.ts. NEVER do float multiplication on a balance — only the monthly rate is a
// float, and a rate is never money.
//
// The model (D-03 / D-04, verified against Reg Z Appendix M1 + CFPB en-36):
//   Each month the minimum payment = the GREATER of
//     (that month's interest + 1% of the pre-interest principal)  OR  a fixed floor (~$35).
//   This "interest + 1%" form genuinely amortizes — it always pays ALL the interest plus
//   1% of principal — so the payoff horizon is real, not a near-perpetuity. (Pitfall 2:
//   a flat-%-of-balance minimum at ~24% APR, where the monthly rate ≈ the percentage,
//   would barely move the balance and run for 100+ years. The "+ 1% of principal" choice
//   is precisely what guarantees termination.) A month < 1200 guard is added so a
//   pathological input can never infinite-loop the browser; the FLOOR, not the guard,
//   is what actually ends the loan once the balance gets small.
//
// VERIFIED ANCHOR (D-04): $5,000 @ 24% APR, interest + 1% / $35 floor →
//   201 months (~16.8 years), total interest $8,441.70. NOT 27 years — lesson 8.5's
//   title flexes to this engine output (the engine is the source of truth, Pitfall 1).

import { type Cents, mulRate, add, sub } from '../lib/money';

const ZERO = 0 as Cents;

/** Hard cap on the month loop so pathological input can't infinite-loop (Pitfall 2). */
const MONTH_GUARD = 1200;

export interface MinPaymentParams {
  /** Starting card balance, in integer cents. */
  balance: Cents;
  /** Nominal annual rate (APR) as a decimal, e.g. 0.24 for 24%. */
  apr: number;
  /** Minimum-payment dollar floor, in integer cents (e.g. $35). */
  floor: Cents;
  /** Fraction of pre-interest principal added to interest (e.g. 0.01 for 1%). */
  pctPrincipal: number;
}

export interface MinPaymentResult {
  /** Months to pay the balance to $0 paying only the minimum. */
  months: number;
  /** months / 12, as a float (a count, not money). */
  years: number;
  /** Total interest paid over the life of the trap, in integer cents. */
  totalInterest: Cents;
}

/**
 * Simulate paying only the minimum on a revolving balance until it hits $0. Pure
 * integer-cents math via money.ts; the monthly rate is the only float. Returns the
 * payoff horizon and total interest. See docs/CALCULATORS.md §6.
 */
export function minPaymentTrap(p: MinPaymentParams): MinPaymentResult {
  let bal: Cents = p.balance;
  let month = 0;
  let totalInterest: Cents = ZERO;
  const monthlyRate = p.apr / 12; // a rate is a float, never money

  while (bal > 0 && month < MONTH_GUARD) {
    month++;
    // This month's interest, and 1% of the PRE-interest principal (D-03).
    const interest = mulRate(bal, monthlyRate);
    const onePctPrincipal = mulRate(bal, p.pctPrincipal);

    // Minimum = greater of (interest + 1% principal) or the floor.
    let min: Cents = add(interest, onePctPrincipal);
    if (min < p.floor) min = p.floor;

    // Interest posts first, then the payment is applied.
    bal = add(bal, interest);
    // The final payment never overshoots the remaining balance.
    if (min > bal) min = bal;
    bal = sub(bal, min);

    totalInterest = add(totalInterest, interest);
  }

  return { months: month, years: month / 12, totalInterest };
}
