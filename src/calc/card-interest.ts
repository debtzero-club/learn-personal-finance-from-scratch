// card-interest.ts — the average-daily-balance credit-card-interest engine (CALC-03).
//
// This is the "bucket-with-a-hole" engine: it shows what a carried card balance
// actually costs you in one statement cycle, and makes the grace period the visible
// toggle between "no leak" and "draining." It powers lessons 7.3 (grace ON → free)
// and 7.4 (grace OFF → the ADB interest charge). PURE and framework-free — NO DOM,
// NO Astro imports — so it stays golden-testable and runs identically at build time,
// in the browser, and in Vitest. Reuses the apr.ts mental model (DPR = APR ÷ 365).
//
// THE RULE (docs/CALCULATORS.md §1): money is ALWAYS integer cents, routed through
// money.ts. NEVER do float multiplication on a balance — only the RATE (the daily
// periodic rate) is a float, and a rate is never money.
//
// The model (D-01 / D-02, verified against CFPB en-44/en-46/en-47):
//   - DPR (daily periodic rate) = APR ÷ 365 (CFPB en-46).
//   - Grace ON  (paidInFull=true): if last statement was paid in full, new purchases
//     are interest-free until the due date → $0 interest this cycle (CFPB en-47).
//     The toggle changes the COMPUTATION, not a label (Pitfall 5).
//   - Grace OFF (paidInFull=false): the grace period is lost. Build the day-by-day
//     balance over the cycle, average it to whole cents (the AVERAGE DAILY BALANCE),
//     then charge interest = ADB × DPR × cycleDays.
//   - Input is the SIMPLIFIED one-purchase / one-payment model (D-02), not a full
//     transaction ledger — beginner-legible, still real average-daily-balance math.

import { type Cents, mulRate, add, sub } from '../lib/money';

const ZERO = 0 as Cents;

export interface CardInterestParams {
  /** Starting balance carried into the cycle, in integer cents. */
  start: Cents;
  /** One optional mid-cycle purchase, in integer cents (D-02). */
  purchase?: Cents;
  /** 1-based day in the cycle the purchase posts. */
  purchaseDay?: number;
  /** One optional mid-cycle payment, in integer cents (D-02). */
  payment?: Cents;
  /** 1-based day in the cycle the payment posts. */
  paymentDay?: number;
  /** Length of the billing cycle in days (e.g. 30). */
  cycleDays: number;
  /** Nominal annual rate (APR) as a decimal, e.g. 0.24 for 24%. */
  apr: number;
  /** "Did you pay last statement in full?" toggle (D-01). true → grace ON. */
  paidInFull: boolean;
}

export interface CardInterestResult {
  /** Average daily balance over the cycle, in integer cents. */
  adb: Cents;
  /** Daily periodic rate = APR ÷ 365 (a float — a rate is never money). */
  dpr: number;
  /** Interest charged for the cycle, in integer cents. $0 when grace is ON. */
  interest: Cents;
}

/**
 * Compute one billing cycle of credit-card interest by the average-daily-balance
 * method, with the grace-period toggle. Pure integer-cents math via money.ts; the
 * daily periodic rate is the only float. See docs/CALCULATORS.md §5.
 */
export function cardInterest(p: CardInterestParams): CardInterestResult {
  // DPR = APR ÷ 365 (CFPB en-46). A rate is a float, never money.
  const dpr = p.apr / 365;

  // Grace ON (D-01): paid in full last statement → new purchases are interest-free.
  // The toggle returns $0 interest — this MUST change the computation, not a label
  // (Pitfall 5). The ADB still reports the starting balance for display continuity.
  if (p.paidInFull) {
    return { adb: p.start, dpr, interest: ZERO };
  }

  // Grace OFF: build the day-by-day balance, summing each day's balance in cents.
  // A purchase adds to the balance on its day; a payment subtracts on its day.
  let balance: Cents = p.start;
  let sum: Cents = ZERO;
  for (let day = 1; day <= p.cycleDays; day++) {
    if (p.purchase && day === p.purchaseDay) balance = add(balance, p.purchase);
    if (p.payment && day === p.paymentDay) balance = sub(balance, p.payment);
    sum = add(sum, balance);
  }

  // Average daily balance = (sum of daily balances) ÷ cycle days, to whole cents.
  // mulRate(sum, 1/cycleDays) does the half-up rounding in money.ts — NEVER a raw
  // float / Math.round on a balance.
  const adb = mulRate(sum, 1 / p.cycleDays);

  // Interest = ADB × DPR × cycleDays, rounded once to whole cents (half-up).
  const interest = mulRate(adb, dpr * p.cycleDays);

  return { adb, dpr, interest };
}
