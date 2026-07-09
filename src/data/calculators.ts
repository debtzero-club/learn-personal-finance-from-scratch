// calculators.ts — the SINGLE source of truth for the set of interactive
// calculator islands a lesson may embed via `calculator:` frontmatter.
//
// This list was historically hand-maintained in THREE places (Phase 4 D-14
// "THREE-PLACES-IN-SYNC"): the z.enum in src/content/config.ts, the CALCULATORS
// registry keys in src/layouts/LessonLayout.astro, and REGISTERED_CALCULATORS in
// scripts/validate-content.mjs. They now all derive from THIS array:
//   - config.ts:            z.enum(CALCULATOR_NAMES)               (schema typo guard)
//   - LessonLayout.astro:   build-time assertion its map keys === CALCULATOR_NAMES
//   - validate-content.mjs: native `.ts` import of CALCULATOR_NAMES (the gate)
//
// `as const` makes this a readonly non-empty tuple so `z.enum(CALCULATOR_NAMES)`
// typechecks (z.enum needs a non-empty tuple). Adding a calculator = add its name
// here, add its component to the LessonLayout map, ship the island.
export const CALCULATOR_NAMES = [
  'compound',
  'apr-apy',
  'card-interest',
  'min-payment',
  'amortization',
  'payoff',
] as const;

/** A registered calculator island name. */
export type CalculatorName = (typeof CALCULATOR_NAMES)[number];
