// apr.ts — nominal APR <-> effective APY rate conversions (CALC-02).
//
// APR (Annual Percentage Rate) is the nominal yearly rate BEFORE compounding is
// folded in; APY (Annual Percentage Yield) is the rate AFTER, on a 365-day year.
// The same nominal APR at a different compounding frequency yields a different
// APY — that gap is the entire point of lesson 6.5.
//
// These are RATE conversions (dimensionless), so float ** is correct here — there
// is NO money in this calculation. A rate only becomes money when fed (as a
// balance) into compound(). Do NOT route this through money.ts.
//
// Locked formula (D-11). This is the equal-periods special case of the CFPB
// Regulation DD (Truth in Savings), Appendix A general APY formula
//   APY = 100[(1 + Interest/Principal)^(365/Days) - 1].
// See docs/CALCULATORS.md for provenance.

/**
 * Nominal APR -> effective APY.
 *   APY = (1 + APR/n)^n - 1
 * @param apr            nominal annual rate as a decimal (e.g. 0.05 for 5%)
 * @param periodsPerYear compounding periods per year, n (e.g. 12 for monthly)
 * @returns effective annual yield as a decimal. aprToApy(0.05, 12) -> 0.0511618977... (5.12%)
 */
export function aprToApy(apr: number, periodsPerYear: number): number {
  return (1 + apr / periodsPerYear) ** periodsPerYear - 1;
}

/**
 * Effective APY -> nominal APR (the inverse of aprToApy).
 *   APR = n * ((1 + APY)^(1/n) - 1)
 * Float ** is not bit-exact reversible, so apyToApr(aprToApy(x)) ~= x, not === x.
 * @param apy            effective annual yield as a decimal (e.g. 0.0511618977)
 * @param periodsPerYear compounding periods per year, n
 * @returns nominal annual rate as a decimal
 */
export function apyToApr(apy: number, periodsPerYear: number): number {
  return periodsPerYear * ((1 + apy) ** (1 / periodsPerYear) - 1);
}
