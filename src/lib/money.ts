// money.ts — the shared, float-safe money primitive for the whole site.
//
// THE RULE: money is ALWAYS integer cents. Convert at the boundary with
// `toCents`, do integer math (`add`/`sub`/`mulRate`/`allocate`), and format at
// the very end with `format`. NEVER do float math on dollar amounts — the
// classic `0.1 + 0.2 === 0.30000000000000004` drift compounds across a
// calculator and silently corrupts results. The branded `Cents` type below
// makes "this number is integer cents" checkable at compile time at zero
// runtime cost (it compiles to a plain `number`).
//
// Every Phase 2 prose lesson (FICA/brackets) and every downstream ⚙ calculator
// (compound, card interest, amortization, payoff) routes through this file, so
// it is golden-tested with exact pinned cent values — a future refactor cannot
// drift any calculator built on it. See src/lib/money.test.ts for the contract.

/**
 * Integer cents, branded so it can't be accidentally mixed with a raw `number`
 * (a rate, a dollar float, a count). Compile-time only — identical JS output.
 * Source: https://www.learningtypescript.com/articles/branded-types
 */
export type Cents = number & { readonly __brand: 'Cents' };

/**
 * Rounding mode for the fractional-cent boundary (`toCents`, `mulRate`).
 * - `half-up`  : round half AWAY from zero (matches most IRS/issuer examples) — default
 * - `trunc`    : drop the fraction toward zero
 * - `bankers`  : round half to even (reduces cumulative bias on long sums)
 */
export type RoundMode = 'half-up' | 'trunc' | 'bankers';

/** Internal: stamp a plain number as `Cents`. Zero runtime cost. */
const asCents = (n: number): Cents => n as Cents;

/**
 * Round a (possibly fractional) cent value to a whole cent.
 *
 * `half-up` is round-half-AWAY-from-zero AND fixes `Math.round`'s asymmetry on
 * negatives (`Math.round(-0.5) === -0` rounds toward +∞, not away from zero),
 * so refunds/credits round symmetrically with charges.
 *
 * Crucially, before the half-up step we snap `x` back to ~10 significant digits
 * to defeat the famous `1.005 * 100 === 100.4999999999…` trap: the multiply in
 * `toCents`/`mulRate` introduces binary float error that is FAR larger than
 * `Number.EPSILON` (here ≈ 1e-13 vs 2.2e-16), so a single-ulp nudge can't
 * bridge it. `toPrecision` reconstitutes the value the author actually meant
 * (100.5) so it rounds up to 101 as expected, while leaving genuine non-tie
 * values (e.g. 100.4) untouched.
 */
function roundTo(x: number, mode: RoundMode = 'half-up'): number {
  // Neutralize accumulated binary-float error from the upstream multiply, then
  // add a single-ulp Number.EPSILON-scaled nudge so a value that is meant to be
  // exactly on the .5 tie never lands a hair below it.
  const snapped = x === 0 ? 0 : Number(x.toPrecision(12));
  const xc = snapped + Math.sign(snapped) * Math.abs(snapped) * Number.EPSILON;
  if (mode === 'trunc') return Math.trunc(xc);
  if (mode === 'bankers') {
    const f = Math.floor(xc);
    const diff = xc - f;
    if (diff < 0.5) return f;
    if (diff > 0.5) return f + 1;
    return f % 2 === 0 ? f : f + 1; // exactly .5 -> round to even
  }
  // half-up = round half away from zero
  return Math.sign(xc) * Math.round(Math.abs(xc));
}

/** Dollars (float, e.g. user input "19.99") -> integer cents. Half-up by default. */
export function toCents(dollars: number, round: RoundMode = 'half-up'): Cents {
  return asCents(roundTo(dollars * 100, round));
}

/**
 * Integer cents -> dollars (float). For DISPLAY / intermediate math only —
 * never re-store the result as money. Round-trip safe with `toCents`.
 */
export function fromCents(c: Cents): number {
  return c / 100;
}

/** Add two cent amounts. Both are already integers, so no rounding needed. */
export function add(a: Cents, b: Cents): Cents {
  return asCents(a + b);
}

/** Subtract `b` cents from `a` cents. Both integers, no rounding needed. */
export function sub(a: Cents, b: Cents): Cents {
  return asCents(a - b);
}

/**
 * Multiply a cent amount by a plain decimal rate (e.g. 0.062 for 6.2% FICA),
 * rounding the fractional-cent result ONCE, immediately, then staying integer.
 * Half-up by default; pass `round` to override (truncate, banker's).
 */
export function mulRate(c: Cents, rate: number, round: RoundMode = 'half-up'): Cents {
  return asCents(roundTo(c * rate, round));
}

/**
 * Split `total` cents into `n` parts as evenly as possible with NO lost (or
 * gained) pennies: the leftover 1-cent remainders go to the FIRST parts, so the
 * returned array sums EXACTLY to `total`.
 *   allocate(toCents(1.00), 3) -> [34, 33, 33]  (sum === 100)
 */
export function allocate(total: Cents, n: number): Cents[] {
  const base = Math.trunc(total / n);
  const remainder = total - base * n; // 0..n-1 leftover cents (sign follows total)
  return Array.from({ length: n }, (_, i) => asCents(base + (i < remainder ? 1 : 0)));
}

/**
 * Format cents as an en-US USD string. Delegates grouping, negatives, and the
 * two-decimal contract to Intl — do NOT hand-roll `$` + toFixed.
 *   format(toCents(1234.56)) -> "$1,234.56"
 */
export function format(c: Cents): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(c / 100);
}
