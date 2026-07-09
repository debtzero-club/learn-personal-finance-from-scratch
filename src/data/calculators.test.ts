// Tests for the calculator registry single source of truth (src/data/calculators.ts)
// AND the content validator's built-in fixtures self-test.
//
// Two things are guarded here:
//  1. CALCULATOR_NAMES is the exact set every consumer derives from (config.ts's
//     z.enum, LessonLayout's CALCULATORS map assertion, validate-content.mjs). If
//     someone edits the list, this pins the expected contents.
//  2. scripts/validate-content.mjs ships a `--fixtures good|bad` self-test that
//     proves the content-sync gate exits 0 on the good fixture and 1 on seeded
//     drift. That self-test was never exercised by `npm test` — it is now, by
//     shelling out to the real script exactly as CI/prebuild would run it.
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CALCULATOR_NAMES } from './calculators';

const VALIDATOR = fileURLToPath(new URL('../../scripts/validate-content.mjs', import.meta.url));

function runValidator(fixture: 'good' | 'bad') {
  return spawnSync(process.execPath, [VALIDATOR, '--fixtures', fixture], {
    encoding: 'utf8',
  });
}

describe('CALCULATOR_NAMES — the single source of truth', () => {
  it('is the expected registered calculator set', () => {
    expect([...CALCULATOR_NAMES]).toEqual([
      'compound',
      'apr-apy',
      'card-interest',
      'min-payment',
      'amortization',
      'payoff',
    ]);
  });

  it('has no duplicate names', () => {
    expect(new Set(CALCULATOR_NAMES).size).toBe(CALCULATOR_NAMES.length);
  });
});

describe('validate-content.mjs — fixtures self-test', () => {
  it('exits 0 on the GOOD fixture', { timeout: 60000 }, () => {
    const res = runValidator('good');
    expect(res.status, res.stderr || res.stdout).toBe(0);
  });

  it('exits 1 on the BAD fixture', { timeout: 60000 }, () => {
    const res = runValidator('bad');
    expect(res.status).toBe(1);
  });
});
