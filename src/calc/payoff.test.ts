import { describe, it, expect } from 'vitest';
// RED (Wave 1, 04-02): ./payoff does NOT exist yet — this task implements it.
// These golden tests are the CONTRACT for the debt-payoff engine (CALC-06): avalanche
// (highest-APR-first) vs snowball (smallest-balance-first), with rollover + an optional
// extra payment. The exact cent integers below are FIXED (verified in 04-RESEARCH §CALC-06).
// A future refactor of payoff.ts must keep producing them. Money is .toBe(exactCents),
// NEVER .toBeCloseTo (D-15). Mirrors compound.test.ts / amortization.test.ts.
//
// ⚠️ Pitfall 4 — the divergent set: the DEFAULT 3-debt scenario MUST make avalanche ≠
// snowball, or the comparison teaches nothing. The guard: the smallest-balance debt (store
// $1,200) is NOT the highest-APR debt (card 25.99%), so the two orderings diverge —
// avalanche pays $99.57 less interest while snowball clears the store card first.
//   store $1,200 @ 20%  |  card $5,000 @ 25.99%  |  auto $9,000 @ 6%  |  +$200/mo extra
//   → avalanche: 29 mo, $2,209.33 interest   |   snowball: 29 mo, $2,308.90 interest
//
// Conventions (CALCULATORS.md §1): round per period via money.ts mulRate half-up; interest
// accrues on every unpaid debt each month BEFORE payments; the budget is constant (Σ
// original minimums + extra — the roll-it-forward mechanic), all leftover thrown at the
// single highest-priority unpaid debt.
//
// Target API (see 04-02-PLAN <action>):
//   payoff({ debts, extra }) -> { avalanche: MethodResult, snowball: MethodResult }
//   MethodResult = { months, totalInterest, order: string[] /* clear order */ }
import { payoff } from './payoff';
import { toCents } from '../lib/money';

describe('payoff — avalanche vs snowball, pinned cents (refactor-proof)', () => {
  // The verified DIVERGENT default set (Pitfall 4). Re-run gives distinct interest totals.
  const debts = [
    { name: 'store', balance: toCents(1200), apr: 0.2 },
    { name: 'card', balance: toCents(5000), apr: 0.2599 },
    { name: 'auto', balance: toCents(9000), apr: 0.06 },
  ];

  it('Case A: the divergent default set pins avalanche vs snowball', () => {
    const r = payoff({ debts, extra: toCents(200) });
    expect(r.avalanche.months).toBe(29); // both methods clear in 29 months...
    expect(r.avalanche.totalInterest).toBe(220933); // $2,209.33 (the math-optimal path)
    expect(r.snowball.months).toBe(29);
    expect(r.snowball.totalInterest).toBe(230890); // $2,308.90 (pays more interest)
  });

  it('Case B: divergence guard — the comparison must teach something (Pitfall 4)', () => {
    const r = payoff({ debts, extra: toCents(200) });
    // The two methods produce DIFFERENT interest — if they were equal the lesson collapses.
    expect(r.avalanche.totalInterest !== r.snowball.totalInterest).toBe(true);
    // Avalanche is the math-optimal (lower interest); the gap is exactly $99.57.
    expect(r.avalanche.totalInterest < r.snowball.totalInterest).toBe(true);
    expect(230890 - 220933).toBe(9957); // avalanche saves $99.57
    expect(r.snowball.totalInterest - r.avalanche.totalInterest).toBe(9957);
  });

  it('Case C: ordering sanity — avalanche targets the 25.99% card, snowball the $1,200 store', () => {
    const r = payoff({ debts, extra: toCents(200) });
    // Avalanche attacks highest APR first → 'card' (25.99%) clears before 'auto'/'store' priority.
    expect(r.avalanche.order[0]).toBe('card');
    // Snowball attacks smallest balance first → 'store' ($1,200) clears first (the motivation win).
    expect(r.snowball.order[0]).toBe('store');
    // Both fully clear all three debts.
    expect(r.avalanche.order.length).toBe(3);
    expect(r.snowball.order.length).toBe(3);
  });
});
