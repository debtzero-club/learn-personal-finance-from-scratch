import { describe, it, expect } from 'vitest';
// RED (Wave 1): ./apr does NOT exist yet — Task 2 implements it.
// APR<->APY are RATE conversions (dimensionless), so float ** is correct here —
// there is NO money in this calculation. The forward aprToApy assertions are
// EXACT (.toBe); the only permitted .toBeCloseTo is the round-trip, because
// float ** is not bit-exact reversible (apyToApr(aprToApy(x)) ~= x, not === x).
//
// Locked formula (D-11, CFPB Regulation DD Appendix A equal-periods special case):
//   APY = (1 + APR/n)^n - 1
//   APR = n * ((1 + APY)^(1/n) - 1)
//
// 5% APR compounded monthly -> 0.0511618977... effective -> displays as "5.12% APY".
// (The literal "0.0511618977" appears here as the documented rounded provenance value;
//  the .toBe below pins the FULL float the function returns.)
import { aprToApy, apyToApr } from './apr';

describe('aprToApy — nominal APR to effective APY', () => {
  it('5% APR compounded monthly === 0.0511618977... (the 5.12% APY headline)', () => {
    // Full float the function returns, pinned exactly. The greppable provenance
    // value is 0.0511618977 (rounds to 5.12% APY for display).
    expect(aprToApy(0.05, 12)).toBe(0.051161897881732976);
  });

  it('annual compounding (n=1): APY equals APR (modulo one ULP of float **)', () => {
    // Mathematically (1 + 0.05/1)^1 - 1 === 0.05, but the binary-float `- 1` step
    // leaves one ULP of error (0.050000000000000044). We pin the engine's TRUE
    // deterministic output exactly (toBe), per the "pin the real run" discipline —
    // and confirm it is 0.05 to full display precision below.
    expect(aprToApy(0.05, 1)).toBe(0.050000000000000044);
    expect(aprToApy(0.05, 1)).toBeCloseTo(0.05, 12); // === 0.05 at any sane precision
  });

  it('0% APR is 0% APY (edge case)', () => {
    expect(aprToApy(0, 12)).toBe(0);
  });
});

describe('apyToApr — effective APY back to nominal APR (inverse)', () => {
  it('round-trips aprToApy(0.05, 12) back to ~0.05 (float ** is not bit-exact)', () => {
    // toBeCloseTo is permitted ONLY here — a float-rate reversal, not a money value.
    expect(apyToApr(aprToApy(0.05, 12), 12)).toBeCloseTo(0.05, 10);
  });

  it('0% APY is 0% APR (edge case)', () => {
    expect(apyToApr(0, 12)).toBe(0);
  });
});
