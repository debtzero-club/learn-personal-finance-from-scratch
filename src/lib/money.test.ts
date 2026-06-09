import { describe, it, expect } from 'vitest';
// RED (Wave 0): ./money does NOT exist yet — Plan 02 (INFRA-02) implements it.
// These golden tests are the CONTRACT. The exact cent integers below are fixed;
// a future refactor of money.ts must keep producing them. Do NOT soften to approximate.
// Target API (see 01-01-PLAN <interfaces>):
//   toCents(dollars, round?) -> Cents (integer cents)
//   fromCents(c) -> dollars (float, display math only)
//   add/sub(a,b) -> Cents ; mulRate(c, rate, round?) -> Cents
//   allocate(total, n) -> Cents[] (sums EXACTLY to total)
//   format(c) -> Intl en-US USD string
import { toCents, fromCents, add, sub, mulRate, allocate, format } from './money';

describe('toCents — dollars to integer cents', () => {
  it('converts whole and fractional dollars exactly', () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1)).toBe(10);
    expect(toCents(0)).toBe(0);
    expect(toCents(1234.56)).toBe(123456);
  });

  it('defeats the 1.005-style float trap under half-up (epsilon-nudged, not 100)', () => {
    // naive Math.round(1.005 * 100) === 100 because 1.005*100 === 100.49999...
    expect(toCents(1.005)).toBe(101);
  });
});

describe('fromCents — integer cents back to dollars', () => {
  it('is the inverse of toCents for display', () => {
    expect(fromCents(toCents(19.99))).toBe(19.99);
    expect(fromCents(toCents(0))).toBe(0);
  });
});

describe('add / sub — integer math, no float drift', () => {
  it('add(0.10, 0.20) === 0.30 with no 0.30000000000000004 drift', () => {
    expect(add(toCents(0.1), toCents(0.2))).toBe(toCents(0.3));
    expect(add(toCents(0.1), toCents(0.2))).toBe(30);
  });

  it('sub(1.00, 0.99) === 1 cent', () => {
    expect(sub(toCents(1.0), toCents(0.99))).toBe(1);
  });
});

describe('mulRate — rate applied to cents, rounded once', () => {
  it('applies the Social Security rate: 6.2% of $1000.00 === $62.00', () => {
    expect(mulRate(toCents(1000.0), 0.062)).toBe(6200);
  });

  it('half-up rounds half AWAY from zero (positive)', () => {
    // 50 cents * 0.01 = 0.5 cents -> rounds away from zero to 1 cent under half-up
    expect(mulRate(toCents(0.5), 0.01, 'half-up')).toBe(1);
  });

  it('negatives are symmetric — refund/credit rounds away from zero too', () => {
    // -50 cents * 0.01 = -0.5 cents -> -1 cent (away from zero, not toward +inf)
    expect(mulRate(toCents(-0.5), 0.01, 'half-up')).toBe(-1);
  });
});

describe('allocate — split cents with no lost pennies', () => {
  it('allocate($1.00, 3) === [34, 33, 33] and sums EXACTLY to 100', () => {
    const parts = allocate(toCents(1.0), 3);
    expect(parts).toEqual([34, 33, 33]);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(100);
  });
});

describe('format — Intl en-US USD', () => {
  it('formats cents as a grouped USD string', () => {
    expect(format(toCents(1234.56))).toBe('$1,234.56');
    expect(format(toCents(0))).toBe('$0.00');
  });
});
