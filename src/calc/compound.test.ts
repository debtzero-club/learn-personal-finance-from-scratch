import { describe, it, expect } from 'vitest';
// RED (Wave 1): ./compound does NOT exist yet — Task 2 implements it.
// These golden tests are the CONTRACT for the cornerstone compounding engine.
// The exact cent integers below are FIXED; a future refactor of compound.ts must
// keep producing them. Do NOT soften any MONEY assertion to an approximate match —
// if a money value only passes approximately, the rounding convention is wrong
// (round per period via money.ts mulRate, NOT round-at-the-end). Mirrors money.test.ts.
//
// Conventions locked in docs/CALCULATORS.md (D-08..D-10):
//   frequency default = monthly; contribution timing = end-of-period (ordinary
//   annuity); rounding cadence = round per period to whole cents via mulRate half-up.
//
// Target API (see 03-01-PLAN <interfaces>):
//   compound({ principal, contribution, annualRate, years, frequency? }) -> Schedule
//   Schedule = { rows: PeriodRow[], finalBalance, totalContributed, totalInterest }
//   PeriodRow = { period, contributed, interest, interestToDate, balance }
import { compound } from './compound';
import { toCents } from '../lib/money';

describe('compound — pinned cents (refactor-proof)', () => {
  // Case A: the clean demonstration that monthly compounding > annual at the same
  // nominal rate. $1,000 start, no contributions, 5% annual rate, monthly, 1 year.
  // The 5.116% EFFECTIVE yield shows up as ~$51.16, not the $50.00 annual compounding gives.
  it('Case A: $1,000, no contributions, 5% annual, monthly, 1 year', () => {
    const s = compound({
      principal: toCents(1000),
      contribution: toCents(0),
      annualRate: 0.05,
      years: 1,
    });
    expect(s.rows.length).toBe(12);
    expect(s.finalBalance).toBe(105116); // $1,051.16 — pinned from the real engine run
    expect(s.totalContributed).toBe(100000); // principal only, no contributions
    expect(s.totalInterest).toBe(5116); // finalBalance - totalContributed
    expect(s.totalInterest).toBe(s.finalBalance - s.totalContributed);
  });

  // Case B: 0% rate is pure contributions, no interest (a required edge case;
  // also the branch downstream amortization needs). No NaN, no negative.
  it('Case B: 0% rate is pure contributions, no interest', () => {
    const s = compound({
      principal: toCents(0),
      contribution: toCents(100),
      annualRate: 0,
      years: 1,
    });
    expect(s.totalInterest).toBe(0);
    expect(s.finalBalance).toBe(120000); // 12 * $100
    expect(s.totalContributed).toBe(120000);
    expect(s.rows.length).toBe(12);
    expect(Number.isNaN(s.finalBalance)).toBe(false);
    expect(s.finalBalance).toBeGreaterThanOrEqual(0);
  });

  // Case C: end-of-period timing edge (D-09). $1,000 start, $100/mo, 5%, monthly,
  // 1 year. The final $100 contribution earns NO interest in its final period
  // because interest posts BEFORE the contribution is added each period.
  it('Case C: end-of-period contribution timing edge ($1,000 + $100/mo, 5%, monthly, 1 year)', () => {
    const s = compound({
      principal: toCents(1000),
      contribution: toCents(100),
      annualRate: 0.05,
      years: 1,
    });
    expect(s.rows.length).toBe(12);
    expect(s.finalBalance).toBe(227904); // $2,279.04 — pinned from the real engine run
    expect(s.totalContributed).toBe(220000); // $1,000 principal + 12 * $100
    expect(s.totalInterest).toBe(7904); // pinned; finalBalance - totalContributed
    expect(s.totalInterest).toBe(s.finalBalance - s.totalContributed);
  });

  // Case D: sampled row pin — lock the SCHEDULE SHAPE, not just the summary, so a
  // refactor that changes per-period posting is caught even if the total matches.
  it('Case D: sampled interior rows are pinned to exact cents', () => {
    const s = compound({
      principal: toCents(1000),
      contribution: toCents(100),
      annualRate: 0.05,
      years: 1,
    });
    // Period 1: interest on $1,000 at 5%/12, posted before the first $100 contribution.
    expect(s.rows[0].period).toBe(1);
    expect(s.rows[0].interest).toBe(417); // mulRate(100000, 0.05/12) = $4.17
    expect(s.rows[0].contributed).toBe(10000); // cumulative contributions after period 1
    expect(s.rows[0].balance).toBe(110417); // $1,000 + $4.17 interest + $100 contribution
    expect(s.rows[0].interestToDate).toBe(417);
    // Final period (12) end-of-period balance equals finalBalance.
    expect(s.rows[11].period).toBe(12);
    expect(s.rows[11].balance).toBe(227904);
    expect(s.rows[11].balance).toBe(s.finalBalance);
    expect(s.rows[11].interestToDate).toBe(s.totalInterest);
  });

  // Case E: annual vs monthly at the same nominal rate. $1,000, no contributions,
  // 5%, frequency 'annual', 1 year -> exactly $50 interest (one period). Demonstrates
  // monthly (Case A: $51.16) > annual ($50.00) at the same nominal rate.
  it('Case E: annual compounding gives less than monthly at the same nominal rate', () => {
    const s = compound({
      principal: toCents(1000),
      contribution: toCents(0),
      annualRate: 0.05,
      years: 1,
      frequency: 'annual',
    });
    expect(s.rows.length).toBe(1);
    expect(s.finalBalance).toBe(105000); // $1,050.00 — exactly $50 interest
    expect(s.totalInterest).toBe(5000);
    expect(s.totalContributed).toBe(100000);
    // The same nominal rate yields MORE under monthly compounding (Case A).
    expect(s.finalBalance).toBeLessThan(105116);
  });
});
