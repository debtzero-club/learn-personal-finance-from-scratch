import { describe, it, expect } from 'vitest';
// RED (Wave 0): ./numbers does NOT exist yet — Plan 03 (INFRA-03) implements it.
//
// CONTRACT FOR PLAN 03 — these KEY NAMES are now fixed. Plan 03 MUST export a
// `NUMBERS` object (as const) whose leaf figures use exactly these keys, each of
// shape { value: number, taxYear: number, source: string }. Money values are
// stored as INTEGER CENTS; rates are plain decimals. (Per 01-RESEARCH.md Pattern 2
// + TY2026 figures table; bracket tables may nest but every leaf still carries
// value/taxYear/source.)
//
//   socialSecurityWageBase        value: 18450000  ($184,500 in cents)
//   socialSecurityEmployeeRate    value: 0.062
//   medicareEmployeeRate          value: 0.0145
//   additionalMedicareRate        value: 0.009
//   contributionLimit401k         value: 2450000   ($24,500 in cents)
//   iraContributionLimit          value: 750000    ($7,500 in cents)
//   hsaContributionLimitSelfOnly  value: 440000    ($4,400 in cents)
//   hsaContributionLimitFamily    value: 875000    ($8,750 in cents)
//
// The spot VALUES below are the hard contract regardless of final key naming.
import { NUMBERS } from './numbers';

// A leaf figure is any object carrying a `value` key.
type Figure = { value: number; taxYear: number; source: string };
const isFigure = (v: unknown): v is Figure =>
  typeof v === 'object' && v !== null && 'value' in (v as Record<string, unknown>);

// Recursively collect every leaf figure object from NUMBERS (handles nested bracket tables).
function collectFigures(node: unknown, acc: Figure[] = []): Figure[] {
  if (isFigure(node)) {
    acc.push(node as Figure);
    return acc;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectFigures(item, acc);
  } else if (typeof node === 'object' && node !== null) {
    for (const v of Object.values(node)) collectFigures(v, acc);
  }
  return acc;
}

describe('NUMBERS provenance — every figure is self-describing', () => {
  it('has at least one figure', () => {
    expect(collectFigures(NUMBERS).length).toBeGreaterThan(0);
  });

  it('every leaf figure carries numeric value, numeric taxYear, and an https source', () => {
    for (const fig of collectFigures(NUMBERS)) {
      expect(typeof fig.value).toBe('number');
      expect(typeof fig.taxYear).toBe('number');
      expect(typeof fig.source).toBe('string');
      expect(fig.source.length).toBeGreaterThan(0);
      expect(fig.source.startsWith('https://')).toBe(true);
    }
  });

  it('every figure is tax year 2026', () => {
    for (const fig of collectFigures(NUMBERS)) {
      expect(fig.taxYear).toBe(2026);
    }
  });
});

describe('NUMBERS spot values — TY2026 (cents for money, decimals for rates)', () => {
  // Resolve a figure by exact key name (Plan 03 must match these names).
  const n = NUMBERS as Record<string, Figure>;

  it('Social Security wage base === $184,500 (18450000 cents)', () => {
    expect(n.socialSecurityWageBase.value).toBe(18450000);
  });

  it('401(k) elective-deferral limit === $24,500 (2450000 cents)', () => {
    expect(n.contributionLimit401k.value).toBe(2450000);
  });

  it('IRA contribution limit === $7,500 (750000 cents)', () => {
    expect(n.iraContributionLimit.value).toBe(750000);
  });

  it('HSA self-only limit === $4,400 (440000 cents)', () => {
    expect(n.hsaContributionLimitSelfOnly.value).toBe(440000);
  });

  it('HSA family limit === $8,750 (875000 cents)', () => {
    expect(n.hsaContributionLimitFamily.value).toBe(875000);
  });

  it('Social Security employee rate === 6.2%', () => {
    expect(n.socialSecurityEmployeeRate.value).toBe(0.062);
  });

  it('Medicare employee rate === 1.45%', () => {
    expect(n.medicareEmployeeRate.value).toBe(0.0145);
  });

  it('Additional Medicare rate === 0.9%', () => {
    expect(n.additionalMedicareRate.value).toBe(0.009);
  });
});
