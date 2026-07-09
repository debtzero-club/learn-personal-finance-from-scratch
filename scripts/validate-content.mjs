// scripts/validate-content.mjs — the content-sync gate + figure staleness audit.
//
// WHY THIS EXISTS: correctness is enforced by the build, not by reviewer vigilance.
// `npm run build` runs this first via the npm `prebuild` lifecycle; a non-zero exit
// aborts the build. It is also exposed standalone as `npm run validate`.
//
// ZERO DEPENDENCIES. It imports the SAME TypeScript modules the site does, using
// Node 24's native type-stripping (no tsx / ts-node / gray-matter / js-yaml). The
// `.ts` extension in the imports below is MANDATORY — Node's ESM resolver throws
// ERR_MODULE_NOT_FOUND without it (see 01-RESEARCH.md Pitfall 3).
//
// INFRA-01 — content-sync gate (hard-fail / exit 1):
//   1. [sync]    curriculum status:'complete' <-> a markdown file exists at its slug (both directions)
//   2. [orphan]  every .md in the lessons dir maps to a `complete` curriculum entry
//   3. [id]      frontmatter id === curriculum id for that slug
//   4. [slug]    slug obeys `${phase}-${order}-<kebab>` (phase/order compared NUMERICALLY)
//   5. [sources] every complete lesson has >=1 sources[] entry
//   6. [quiz]    (nice-to-have) every quiz answer is an in-range index into its options
//
// INFRA-04 — figure staleness audit over numbers.ts:
//   - [figure]   HARD-FAIL if any leaf figure lacks a numeric taxYear or a non-empty source
//   - [stale]    WARN ONLY (exit stays 0) when a figure's taxYear < the current calendar year,
//                so a January build doesn't break before the IRS/SSA publish new figures.
//
// SELF-TEST: `--fixtures <dir>` validates the Plan 01 fixtures instead of the real tree,
// proving the gate exits 1 on seeded drift and 0 on the good fixture without touching real content.

import { allLessons } from '../src/data/curriculum.ts'; // .ts extension is REQUIRED (Node 24)
import { NUMBERS } from '../src/data/numbers.ts';
import { CALCULATOR_NAMES } from '../src/data/calculators.ts'; // single source of truth (D-14)
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const REAL_LESSON_DIR = fileURLToPath(new URL('../src/content/lessons/', import.meta.url));
const FIXTURES_DIR = fileURLToPath(new URL('./fixtures/', import.meta.url));

// Calculator islands a lesson may embed via `calculator:` frontmatter (D-03).
// Imported from the SINGLE source of truth (src/data/calculators.ts) that the
// z.enum in src/content/config.ts and the CALCULATORS registry in
// src/layouts/LessonLayout.astro also derive from (Phase 4 D-14). A declared name
// not in this list fails the build (mirrors the figures[] resolves-to-registered
// check). The Zod enum catches typos at schema time; this catches a name that
// parses but has no registered component (e.g. a stale name after a calculator is
// removed).
const REGISTERED_CALCULATORS = CALCULATOR_NAMES;

// --- tiny frontmatter reader (NO YAML dependency) --------------------------
// We only need a few scalar fields plus the presence of a non-empty sources list and
// the quiz block — Astro's Zod schema (src/content/config.ts) does the full validation
// at build time. This reader handles the real lesson shape: quoted `id`, unquoted
// `status`, a block `sources:` list, and a block `quiz:` list.
function readFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { __block: '' };
  const block = m[1];
  const fm = { __block: block };
  for (const line of block.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*["']?([^"'\n]*)["']?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  // sources presence: a non-empty block list (`sources:\n  - ...`) OR a non-empty inline
  // array (`sources: [ ... ]`). An empty `sources: []` or a bare `sources:` counts as NONE.
  fm.__hasSources =
    /\n\s*sources:\s*\n\s*-/.test('\n' + block) || /\n\s*sources:\s*\[[^\]]+\]/.test('\n' + block);
  return fm;
}

// Parse quiz items just enough to bound-check each `answer` index against its `options`.
// The block-YAML shape is:
//   quiz:
//     - q: "..."
//       options:
//         - "A"
//         - "B"
//       answer: 1
// We count the `-` items under each `options:` and read the sibling `answer:` value.
// If the block can't be parsed confidently we skip silently (the Zod schema still guards it).
function quizAnswerErrors(block, id) {
  const errs = [];
  const lines = block.split(/\r?\n/);
  const quizStart = lines.findIndex((l) => /^quiz:\s*$/.test(l));
  if (quizStart === -1) return errs;
  // Walk the quiz region; each `- q:` opens an item, each `options:` opens an options list,
  // `answer:` records the chosen index. Indentation tells us when the quiz block ends.
  let optionCount = null;
  let answer = null;
  const flush = () => {
    if (optionCount !== null && answer !== null) {
      if (!Number.isInteger(answer) || answer < 0 || answer >= optionCount) {
        errs.push(`[quiz] ${id}: answer index ${answer} out of range (0..${optionCount - 1})`);
      }
    }
    optionCount = null;
    answer = null;
  };
  let inOptions = false;
  for (let i = quizStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\S/.test(line)) break; // dedented to a new top-level key -> quiz block ended
    const trimmed = line.trim();
    if (/^-\s+q:/.test(trimmed)) {
      flush(); // starting a new quiz item -> finalize the previous one
      inOptions = false;
    } else if (/^options:\s*$/.test(trimmed)) {
      optionCount = 0;
      inOptions = true;
    } else if (inOptions && /^-\s/.test(trimmed)) {
      optionCount = (optionCount ?? 0) + 1;
    } else if (/^answer:\s*\d+\s*$/.test(trimmed)) {
      answer = Number(trimmed.replace(/^answer:\s*/, '').trim());
      inOptions = false;
    } else if (/^\w+:/.test(trimmed) && !/^-\s/.test(trimmed)) {
      inOptions = false; // any other key (q, explain) ends the options list
    }
  }
  flush();
  return errs;
}

// --- figures binding (Phase 2 / 02-01) -------------------------------------
// A figure-bearing lesson lists the numbers.ts keys its prose depends on via a
// `figures:` frontmatter array. The scalar `kv` regex in readFrontmatter CANNOT read
// arrays, so this dedicated parser (mirroring the __hasSources style) reads BOTH YAML
// forms from the frontmatter block:
//   block list:    figures:\n  - key1\n  - key2
//   inline array:  figures: [key1, key2]
// An empty `figures: []` or a bare `figures:` returns []. Returns the raw keys with
// quotes/whitespace stripped.
function parseFiguresList(block) {
  if (!block) return [];
  const lines = block.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => /^figures:/.test(l));
  if (startIdx === -1) return [];
  const startLine = lines[startIdx];

  // Inline array form: figures: [a, b, c]
  const inline = startLine.match(/^figures:\s*\[([^\]]*)\]\s*$/);
  if (inline) {
    return inline[1]
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter((s) => s.length > 0);
  }

  // Block list form: figures:\n  - a\n  - b   (anything after `figures:` on the same line is ignored)
  const keys = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\S/.test(line)) break; // dedented to a new top-level key -> figures block ended
    const item = line.trim().match(/^-\s*(.+?)\s*$/);
    if (item) {
      keys.push(item[1].replace(/^["']|["']$/g, '').trim());
    } else if (line.trim() === '') {
      continue; // tolerate blank lines inside the block
    } else {
      break; // a non-list indented line -> block ended
    }
  }
  return keys;
}

// Resolve a dot-path (e.g. "socialSecurityWageBase" or "federalIncomeTaxBrackets.single")
// against the NUMBERS registry. Returns true iff it lands on a figure LEAF ({value}|{rate})
// or a non-empty bracket array ([{rate,...}, ...]). The non-leaf parent
// `federalIncomeTaxBrackets` and a bogus key (e.g. `headOfHousehold`) MUST return false.
function figureKeyResolves(numbers, dotPath) {
  const parts = dotPath.split('.');
  let node = numbers;
  for (const p of parts) {
    if (node == null || typeof node !== 'object') return false;
    node = node[p];
  }
  if (node == null || typeof node !== 'object') return false;
  const isFigureLeaf = 'value' in node || 'rate' in node;
  const isBracketArray =
    Array.isArray(node) &&
    node.length > 0 &&
    node.every((r) => r && typeof r === 'object' && 'rate' in r);
  return isFigureLeaf || isBracketArray;
}

// --- INFRA-01: content-sync checks, parameterized over (lessons, lessonDir) -
function checkContentSync(lessons, lessonDir) {
  const errors = [];
  const expectedFiles = new Set();

  for (const l of lessons) {
    if (l.status !== 'complete') continue;
    const slug = l.slug ?? '';
    const file = path.join(lessonDir, `${slug}.md`);
    expectedFiles.add(`${slug}.md`);

    // 1. file existence (complete -> file must exist)
    if (!existsSync(file)) {
      errors.push(`[sync] ${l.id}: complete but no file at ${slug}.md`);
      // still run the slug check below (it needs no file), then continue
    }

    // 4. slug convention: `${phase}-${order}-<kebab>`, phase/order matched NUMERICALLY.
    // Building the regex from the numeric phase/order means `7-10-...` is valid (a string
    // compare would wrongly sort `7-10` before `7-2`). Kebab tail is `[a-z0-9-]+`.
    const slugRe = new RegExp(`^${l.phase}-${l.order}-[a-z0-9-]+$`);
    if (!slugRe.test(slug)) {
      errors.push(`[slug] ${l.id}: slug "${slug}" violates \`${l.phase}-${l.order}-<kebab>\``);
    }

    if (!existsSync(file)) continue; // can't read frontmatter of a missing file

    const fm = readFrontmatter(readFileSync(file, 'utf8'));

    // 3. id match (frontmatter id, quotes stripped, === curriculum id)
    if (fm.id !== l.id) {
      errors.push(`[id] ${slug}: frontmatter id "${fm.id}" != curriculum "${l.id}"`);
    }

    // 5. sources: at least one entry
    if (!fm.__hasSources) {
      errors.push(`[sources] ${l.id}: complete lesson has no sources[]`);
    }

    // 6. quiz answer-index bound check (nice-to-have)
    errors.push(...quizAnswerErrors(fm.__block, l.id));

    // 7. figures binding (Phase 2 / 02-01): for a lesson that declares figures[],
    //    every key must resolve in numbers.ts AND the lesson must cite an IRS/SSA source.
    //    Both clauses are scoped INSIDE `if (figures.length > 0)` so the non-figure
    //    banking/budgeting/saving lessons (CFPB/Fed/FINRA) keep passing the generic
    //    ≥1-source check unchanged (Pitfall 2).
    const figures = parseFiguresList(fm.__block);
    if (figures.length > 0) {
      for (const key of figures) {
        if (!figureKeyResolves(NUMBERS, key)) {
          errors.push(`[figures] ${l.id}: key "${key}" does not resolve in numbers.ts`);
        }
      }
      if (!/https:\/\/(www\.)?(irs|ssa)\.gov/.test(fm.__block)) {
        errors.push(`[figures] ${l.id}: figure lesson must cite an IRS/SSA source`);
      }
    }

    // 8. calculator binding (Phase 3 / 03-02): if a lesson declares `calculator: <name>`,
    //    that name must resolve to a REGISTERED island (same spirit as the figures[] key
    //    check). The scalar `kv` reader in readFrontmatter already captures fm.calculator,
    //    so no new parser is needed. The Zod enum in config.ts also guards typos at build
    //    time; this validator gate is the standalone (npm run validate) proof.
    if (fm.calculator && fm.calculator.trim() !== '' && !REGISTERED_CALCULATORS.includes(fm.calculator)) {
      errors.push(`[calculator] ${l.id}: "${fm.calculator}" is not a registered calculator`);
    }
  }

  // 2. orphan check: every .md file in the dir must map to a `complete` curriculum entry
  if (existsSync(lessonDir)) {
    for (const f of readdirSync(lessonDir)) {
      if (!f.endsWith('.md')) continue;
      if (!expectedFiles.has(f)) {
        errors.push(`[orphan] ${f}: markdown file with no complete curriculum entry`);
      }
    }
  }

  return errors;
}

// --- INFRA-04: figure staleness audit over a NUMBERS-shaped object ----------
// Walks every leaf figure (an object carrying a `value` key). Hard-fails on a missing
// taxYear/source; warns (non-blocking) when a figure's taxYear is behind the current year.
function auditFigures(numbers, currentYear) {
  const errors = [];
  const warnings = [];

  const walk = (node, keyPath) => {
    if (node === null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${keyPath}[${i}]`));
      return;
    }
    // A leaf figure is an object with a numeric `value` (a single figure) OR a `rate`
    // (a bracket row). Both carry their own taxYear + source.
    const isLeaf =
      Object.prototype.hasOwnProperty.call(node, 'value') ||
      Object.prototype.hasOwnProperty.call(node, 'rate');
    if (isLeaf) {
      if (typeof node.taxYear !== 'number') {
        errors.push(`[figure] ${keyPath}: missing or non-numeric taxYear`);
      } else if (node.taxYear < currentYear) {
        warnings.push(
          `[stale] ${keyPath}: taxYear ${node.taxYear} < current year ${currentYear} — re-verify per docs/ANNUAL-REVIEW.md`
        );
      }
      if (typeof node.source !== 'string' || node.source.trim() === '') {
        errors.push(`[figure] ${keyPath}: missing or empty source`);
      }
      return; // a figure leaf has no nested figures
    }
    for (const [k, child] of Object.entries(node)) {
      walk(child, keyPath ? `${keyPath}.${k}` : k);
    }
  };

  walk(numbers, '');
  return { errors, warnings };
}

// --- fixtures resolver ------------------------------------------------------
// Accepts `--fixtures <dir>` where <dir> is one of: a path ending in `good`/`bad`,
// the bare words `good`/`bad`, or a lessons dir (`lessons-good`/`lessons-bad`). Resolves
// to the matching fixture curriculum (curriculum.good.mjs / curriculum.bad.mjs) + lessons dir.
async function resolveFixtures(arg) {
  const lower = (arg || '').toLowerCase();
  const isBad = /bad/.test(lower);
  const isGood = /good/.test(lower);
  if (!isBad && !isGood) {
    throw new Error(
      `--fixtures expects a path containing "good" or "bad" (got "${arg}"). ` +
        `Try: --fixtures good  |  --fixtures bad`
    );
  }
  const kind = isBad ? 'bad' : 'good';
  const curriculumPath = path.join(FIXTURES_DIR, `curriculum.${kind}.mjs`);
  const lessonDir = path.join(FIXTURES_DIR, `lessons-${kind}`);
  const mod = await import(pathToFileURL(curriculumPath).href);
  return { lessons: mod.allLessons(), lessonDir, kind };
}

// --- main -------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const fixturesIdx = args.indexOf('--fixtures');
  const fixturesMode = fixturesIdx !== -1;

  let lessons;
  let lessonDir;
  let label;

  if (fixturesMode) {
    const arg = args[fixturesIdx + 1];
    const resolved = await resolveFixtures(arg);
    lessons = resolved.lessons;
    lessonDir = resolved.lessonDir;
    label = `fixtures (${resolved.kind})`;
  } else {
    lessons = allLessons();
    lessonDir = REAL_LESSON_DIR;
    label = 'real tree';
  }

  const errors = checkContentSync(lessons, lessonDir);

  // The figure audit always runs against the REAL numbers.ty file. In fixtures mode we
  // still run it (the real numbers must stay valid), but the bad-fixture exit code is
  // driven by the seeded content-sync drift above, not the figures.
  const { errors: figErrors, warnings: figWarnings } = auditFigures(
    NUMBERS,
    new Date().getFullYear()
  );
  errors.push(...figErrors);

  // Warnings are advisory and never affect the exit code.
  for (const w of figWarnings) console.warn(`WARN ${w}`);

  if (errors.length) {
    console.error(`validate-content: FAILED (${label}) — ${errors.length} error(s):`);
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const completeCount = lessons.filter((l) => l.status === 'complete').length;
  console.log(`validate-content: OK (${label}, ${completeCount} complete lessons)`);
  process.exit(0);
}

main().catch((err) => {
  console.error('validate-content: crashed —', err?.stack || err);
  process.exit(1);
});
