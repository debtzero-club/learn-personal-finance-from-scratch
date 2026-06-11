import { describe, it, expect } from 'vitest';
// RED (Wave 1, Phase 4): ./card-interest does NOT exist yet — this file is written
// FIRST, then card-interest.ts is implemented until these go green (D-15 RED-first).
//
// These golden tests are the CONTRACT for the credit-card-interest engine (CALC-03).
// The exact cent integers below are FIXED and were captured from the project's own
// half-up integer-cents arithmetic (money.ts): a future refactor of card-interest.ts
// MUST keep producing them. NEVER soften a MONEY assertion to .toBeCloseTo — if a
// money value only passes approximately, the rounding convention is wrong (round per
// period via money.ts mulRate, NOT round-at-the-end). Mirrors compound.test.ts.
//
// Model (D-01 / D-02, verified against CFPB en-44/en-46/en-47):
//   - daily periodic rate DPR = APR / 365 (a float — a rate is never money)
//   - grace ON  (paidInFull=true): new purchases are interest-free → interest === 0
//   - grace OFF (paidInFull=false): build the day-by-day balance over the cycle,
//     average to whole cents (the average daily balance), then ADB × DPR × cycleDays
//
// Target API (see 04-01-PLAN <interfaces>):
//   cardInterest({ start, purchase?, purchaseDay?, payment?, paymentDay?,
//                  cycleDays, apr, paidInFull }) -> { adb, dpr, interest }
import { cardInterest } from './card-interest';
import { toCents } from '../lib/money';

describe('cardInterest — pinned cents (refactor-proof)', () => {
  // The $5,000 anchor (D-11): the running first-job person carries a $5,000 card
  // balance. One 30-day cycle at 24% APR, carrying a balance (grace lost), with no
  // mid-cycle purchase or payment → the average daily balance IS the flat $5,000,
  // and the cycle interest is $98.63. This is the monthly card cost lesson 7.4 shows.
  it('Case A: $5,000 flat carry, 30-day cycle, 24% APR, grace OFF → ADB $5,000.00, interest $98.63', () => {
    const r = cardInterest({
      start: toCents(5000),
      cycleDays: 30,
      apr: 0.24,
      paidInFull: false,
    });
    expect(r.adb).toBe(500000); // $5,000.00 average daily balance
    expect(r.interest).toBe(9863); // $98.63 — ADB × (0.24/365) × 30, half-up
  });

  // The true-ADB worked example (lesson 7.4): a mid-cycle purchase and payment move
  // the daily balance, so the AVERAGE daily balance ($2,240.00) is what interest is
  // charged on — NOT the start, NOT the end balance. This is the whole point of "average
  // daily." $2,000 start, +$500 on day 10, −$300 on day 20, 30-day cycle, 24% APR.
  it('Case B: $2,000 +$500 d10 −$300 d20, 30-day cycle, 24% APR, grace OFF → ADB $2,240.00, interest $44.19', () => {
    const r = cardInterest({
      start: toCents(2000),
      purchase: toCents(500),
      purchaseDay: 10,
      payment: toCents(300),
      paymentDay: 20,
      cycleDays: 30,
      apr: 0.24,
      paidInFull: false,
    });
    expect(r.adb).toBe(224000); // $2,240.00 — the true average daily balance
    expect(r.interest).toBe(4419); // $44.19 — ADB × DPR × days, half-up
  });

  // Grace ON (D-01, Pitfall 5): the "paid last statement in full?" toggle changes the
  // COMPUTATION, not a label. Same inputs as Case A, but paidInFull=true → the grace
  // period applies, new purchases accrue $0 interest, the bucket doesn't leak. The
  // interest MUST differ from the grace-OFF figure (the contrast IS lessons 7.3 vs 7.4).
  it('Case C: grace ON (paidInFull=true) → interest $0, and it differs from grace OFF', () => {
    const off = cardInterest({
      start: toCents(5000),
      cycleDays: 30,
      apr: 0.24,
      paidInFull: false,
    });
    const on = cardInterest({
      start: toCents(5000),
      cycleDays: 30,
      apr: 0.24,
      paidInFull: true,
    });
    expect(on.interest).toBe(0); // grace works → no interest this cycle
    expect(on.interest).not.toBe(off.interest); // the toggle flips the number (9863 vs 0)
  });

  // DPR is a RATE, not money: it is the daily periodic rate APR ÷ 365, a float. Rates
  // may carry float artifacts, so compare the RATE with toBeCloseTo (never a money rule).
  it('Case D: dpr is the daily periodic rate APR ÷ 365 (a float, not money)', () => {
    const r = cardInterest({
      start: toCents(5000),
      cycleDays: 30,
      apr: 0.24,
      paidInFull: false,
    });
    expect(r.dpr).toBeCloseTo(0.24 / 365, 12); // ~0.000657534
  });
});
