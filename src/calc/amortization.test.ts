import { describe, it, expect } from 'vitest';
// RED (Wave 1, 04-02): ./amortization does NOT exist yet — this task implements it.
// These golden tests are the CONTRACT for the loan-amortization engine (CALC-05).
// The exact cent integers below are FIXED (verified in 04-RESEARCH §CALC-05 by re-running
// the model in the project's half-up integer-cents arithmetic). A future refactor of
// amortization.ts must keep producing them. Do NOT soften any MONEY assertion to an
// approximate match — money is .toBe(exactCents), NEVER .toBeCloseTo (D-15). If a money
// value only passes approximately, the rounding convention is wrong (round per period via
// money.ts mulRate, NOT round-at-the-end). Mirrors compound.test.ts.
//
// Conventions locked in docs/CALCULATORS.md §1 (D-08..D-10) and CONTEXT D-05/D-06/D-07:
//   round per period to whole cents via mulRate half-up; end-of-period interest posts
//   BEFORE the payment; the (1+r)^n payment factor is a pure FLOAT (a rate, like apr.ts's
//   **) and only the resulting payment is rounded to cents.
//
// The three guarded behaviors (each a research Pitfall):
//   • Pitfall 3 — the final payment reconciles on the LAST SCHEDULED period (m === months
//     for the no-extra case), so the schedule closes on EXACTLY $0.00 in `months` rows.
//     A naive cap-only loop appends a phantom 61st payment for a 60-month loan — guarded
//     here by asserting rows.length === 60 AND finalBalance === 0.
//   • The 0%-APR branch (BNPL "pay in 4") = principal ÷ term, $0 interest.
//   • The optional extra-payment field finishes the loan EARLY (lesson 8.7).
//
// Target API (see 04-02-PLAN <action>):
//   amortize({ principal, apr, months, extra? }) -> AmortResult
//   AmortResult = { payment, months, totalInterest, rows, finalBalance }
//   AmortRow    = { m, interest, principalPaid, pay, balance }
import { amortize } from './amortization';
import { toCents } from '../lib/money';

describe('amortize — pinned cents (refactor-proof)', () => {
  // Case A: the D-05 anchor auto loan — $20,000 @ 7% APR over 60 months.
  // Verified golden: payment $396.02, finishes in EXACTLY 60 months (no phantom 61st),
  // total interest $3,761.48, final balance $0.00. row1 splits $116.67 interest /
  // $279.35 principal (early = mostly interest, the split-bar teaching moment for 8.3),
  // and the reconciled last payment is $396.30 (absorbs accumulated per-period rounding).
  it('Case A: $20,000 @ 7% APR / 60 mo closes on $0.00 in exactly 60 months', () => {
    const a = amortize({ principal: toCents(20000), apr: 0.07, months: 60 });
    expect(a.payment).toBe(39602); // $396.02 fixed monthly payment
    expect(a.months).toBe(60); // finishes in exactly the scheduled term
    expect(a.rows.length).toBe(60); // ⚠️ no phantom 61st payment (Pitfall 3)
    expect(a.finalBalance).toBe(0); // lands on exactly $0.00
    expect(a.totalInterest).toBe(376148); // $3,761.48 total interest
    // The split-bar contract: row 1 is mostly interest.
    expect(a.rows[0].interest).toBe(11667); // $116.67 — interest on $20,000 @ 7%/12
    expect(a.rows[0].principalPaid).toBe(27935); // $279.35 — the rest of the payment
    expect(a.rows[0].balance).toBe(1972065); // $19,720.65 — balance after payment 1
    expect(a.rows[59].pay).toBe(39630); // $396.30 — the reconciled final payment
    // The reconcile guard: the no-extra case finishes in EXACTLY `months` rows.
    expect(a.rows.length).toBe(60);
  });

  // Case B: extra payments crush the loan (D-06, lesson 8.7). +$100/mo on the same
  // $20,000 @ 7% / 60 mo loan finishes in 47 months (saves 13) and cuts total interest
  // to $2,867.74 (saves $893.74). The loan finishes EARLY — reconcile on the clearing period.
  it('Case B: +$100/mo extra finishes in 47 months and saves interest', () => {
    const a = amortize({ principal: toCents(20000), apr: 0.07, months: 60, extra: toCents(100) });
    expect(a.months).toBe(47); // saves 13 months vs the 60-month base
    expect(a.totalInterest).toBe(286774); // $2,867.74 (base $3,761.48 − $893.74 saved)
    expect(a.finalBalance).toBe(0); // still lands on exactly $0.00
    expect(a.rows.length).toBe(47);
  });

  // Case C: the 0%-APR branch — BNPL "pay in 4" ($200 over 4 months, lesson 7.10).
  // payment = principal ÷ term = $50.00; 4 payments; $0 interest; final $0.00.
  it('Case C: 0%-APR BNPL $200/4 → $50.00/payment, $0 interest', () => {
    const a = amortize({ principal: toCents(200), apr: 0, months: 4 });
    expect(a.payment).toBe(5000); // $50.00 — principal ÷ term
    expect(a.rows.length).toBe(4); // exactly 4 payments
    expect(a.months).toBe(4);
    expect(a.totalInterest).toBe(0); // 0% APR → no interest
    expect(a.finalBalance).toBe(0); // closes on $0.00
  });
});
