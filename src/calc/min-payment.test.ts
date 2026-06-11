import { describe, it, expect } from 'vitest';
// RED (Wave 1, Phase 4): ./min-payment does NOT exist yet — this file is written
// FIRST, then min-payment.ts is implemented until these go green (D-15 RED-first).
//
// These golden tests are the CONTRACT for the minimum-payment-trap engine (CALC-04).
// The exact cent integers below are FIXED and were captured from the project's own
// half-up integer-cents arithmetic (money.ts): a future refactor MUST keep producing
// them. NEVER soften a MONEY assertion to .toBeCloseTo. Mirrors compound.test.ts and
// card-interest.test.ts.
//
// Model (D-03 / D-04, verified against Reg Z Appendix M1 + CFPB en-36):
//   Each month the minimum payment = the GREATER of
//     (that month's interest + 1% of the pre-interest principal)  OR  a $35 floor.
//   The balance genuinely amortizes (the "+ 1% of principal" guarantees termination —
//   Pitfall 2: a flat-%-of-balance minimum at 24% would be a near-perpetuity).
//
// Target API (see 04-01-PLAN <interfaces>):
//   minPaymentTrap({ balance, apr, floor, pctPrincipal }) -> { months, years, totalInterest }
import { minPaymentTrap } from './min-payment';
import { toCents } from '../lib/money';

describe('minPaymentTrap — pinned cents (refactor-proof)', () => {
  // The D-04 anchor: the running first-job person's $5,000 card balance at 24% APR,
  // paying ONLY the minimum (interest + 1% of principal, $35 floor). The engine — not
  // a placeholder headline — is the source of truth: it pays off in 201 months
  // (~16.8 years, NOT "27 years") with $8,441.70 total interest (totalPaid $13,441.70).
  // Lesson 8.5's title flexes to this verified number (D-04, Pitfall 1).
  it('Case A: $5,000 @ 24% APR, min-only → 201 months, $8,441.70 total interest', () => {
    const r = minPaymentTrap({
      balance: toCents(5000),
      apr: 0.24,
      floor: toCents(35),
      pctPrincipal: 0.01,
    });
    expect(r.months).toBe(201); // ~16.8 years
    expect(r.totalInterest).toBe(844170); // $8,441.70 — pinned from the real engine run
  });

  // Termination is GUARANTEED by the floor (D-03 / Pitfall 2), not by the loop guard.
  // Assert the payoff is finite and well under the 1200-month guard — proving the $35
  // floor (not the guard) is what ends the loan once the balance gets small.
  it('Case B: terminates by the floor — months is finite and far below the 1200 guard', () => {
    const r = minPaymentTrap({
      balance: toCents(5000),
      apr: 0.24,
      floor: toCents(35),
      pctPrincipal: 0.01,
    });
    expect(Number.isFinite(r.months)).toBe(true);
    expect(r.months).toBeLessThan(1200); // the floor terminated it, not the guard
    expect(r.years).toBeCloseTo(201 / 12, 6); // years is months / 12 (16.75)
  });

  // Sensitivity sanity (the floor governs the endgame): a higher APR drags the payoff
  // out and piles on interest. 25.99% APR on the same $5,000 → 204 months / $9,211.50.
  // Pinned exact cents to lock the formula shape across the rate range.
  it('Case C: $5,000 @ 25.99% APR → 204 months, $9,211.50 total interest', () => {
    const r = minPaymentTrap({
      balance: toCents(5000),
      apr: 0.2599,
      floor: toCents(35),
      pctPrincipal: 0.01,
    });
    expect(r.months).toBe(204);
    expect(r.totalInterest).toBe(921150); // $9,211.50
  });
});
