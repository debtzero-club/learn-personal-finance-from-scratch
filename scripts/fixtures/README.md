# Validator self-test fixtures

These fixtures let **Plan 05's** content-sync validator (`scripts/validate-content.mjs`)
prove — not assume — that each INFRA-01 / INFRA-04 check actually **fails the build on
bad input and passes on good input**. They use lesson ids in the **9.x range** so they
never collide with real authored lessons (Phases 1–14, with 9 being Student Loans in the
real curriculum — the fixture ids `9.1`–`9.4` live only inside `scripts/fixtures/` and are
never imported by the site).

## How Plan 05 must consume these

Plan 05's validator must accept a **fixtures directory** so these can be exercised in CI
without touching the real tree. Recommended shape (Plan 05's discretion on exact flag name):

```bash
# good tree -> exit 0
node scripts/validate-content.mjs --fixtures scripts/fixtures/good
# bad tree  -> exit 1
node scripts/validate-content.mjs --fixtures scripts/fixtures/bad
```

…or a small self-test harness that imports `curriculum.good.mjs` / `curriculum.bad.mjs`
and points the lesson-dir at `lessons-good/` / `lessons-bad/` respectively. Either way the
validator's core logic (import a curriculum, scan a lessons dir, run the four checks +
staleness audit) must be parameterizable over `(curriculum, lessonDir)`.

Each `curriculum.*.mjs` exports `allLessons()` and `curriculum` mirroring
`src/data/curriculum.ts` so the validator can import either named export.

## GOOD tree — validator MUST accept (exit 0)

| Fixture | Curriculum entry | Why it passes |
| --- | --- | --- |
| `curriculum.good.mjs` + `lessons-good/9-1-good-fixture.md` | `9.1` complete, slug `9-1-good-fixture` | file exists; frontmatter `id: "9.1"` matches curriculum; slug obeys `${phase}-${order}-<kebab>`; ≥1 `sources[]` entry |
| `curriculum.good.mjs` + `lessons-good/9-2-good-figures.md` | `9.2` complete, slug `9-2-good-figures` | `figures: [socialSecurityEmployeeRate]` resolves to a real leaf in `numbers.ts` AND the lesson cites an IRS source — passes the figures key-resolve + IRS/SSA-source check |

**Expected exit code: 0**

## BAD tree — validator MUST reject (exit 1)

`curriculum.bad.mjs` declares six complete lessons, each engineered to trip exactly ONE
check. The lessons dir `lessons-bad/` supplies the markdown that triggers them.

| Check (INFRA-01 / INFRA-04 / figures) | Curriculum entry | Markdown fixture | What's wrong |
| --- | --- | --- | --- |
| **[id] frontmatter id ≠ curriculum id** | `9.1` (curriculum says id `9.1`) | `lessons-bad/9-1-id-mismatch.md` (frontmatter `id: "9.9"`) | the file's `id` does not match the curriculum's `id` for that slug |
| **[sources] complete lesson has no sources** | `9.2` | `lessons-bad/9-2-no-sources.md` (no `sources:` block) | a `complete` lesson is missing the required ≥1 authoritative source |
| **[slug] slug violates `${phase}-${order}-<kebab>`** | `9.3` (slug `badslug-orphan`) | `lessons-bad/badslug-orphan.md` | slug does not start with `9-3-`; also has no matching real entry, so it doubles as the **orphan-md** direction |
| **[sync] complete but no file** | `9.4` (slug `9-4-missing`) | _(none — file intentionally absent)_ | curriculum marks the lesson `complete` but no markdown file exists at its slug |
| **[figures] bogus key** | `9.5` (slug `9-5-bad-figure-key`) | `lessons-bad/9-5-bad-figure-key.md` (`figures: [notARealKey]` + valid IRS source) | a declared `figures` key does not resolve to a leaf/bracket-array in `numbers.ts` (the valid IRS source isolates the key failure) |
| **[figures] non-IRS/SSA source** | `9.6` (slug `9-6-bad-figure-source`) | `lessons-bad/9-6-bad-figure-source.md` (resolvable key + CFPB-only source) | a figure-bearing lesson cites a source but none is IRS/SSA (the resolvable key isolates the source failure) |

**Expected exit code: 1** (the validator should report ALL violations it finds, then
`process.exit(1)` if `errors.length > 0`).

### Coverage map → VALIDATION.md Wave 0 requirement

> "validator self-test fixtures — a known-bad tree (orphan/missing/id-mismatch/bad-slug/
> no-source/missing-figure-field) the validator must reject, and a known-good case it must
> accept"

- **id-mismatch** → `9-1-id-mismatch.md`
- **no-source** → `9-2-no-sources.md`
- **bad-slug** + **orphan-md** → `badslug-orphan.md` (slug violation AND no matching complete entry)
- **missing** (complete-but-no-file / sync) → `9.4` curriculum entry with no markdown file
- **figures bogus-key** → `9-5-bad-figure-key.md` (a declared `figures` key does not resolve in `numbers.ts`)
- **figures non-IRS/SSA source** → `9-6-bad-figure-source.md` (a figure lesson cites a source but none is IRS/SSA)
- **good** → `9-1-good-fixture.md`; **good figures** → `9-2-good-figures.md` (resolvable key + IRS source)

> **missing-figure-field** (INFRA-04 staleness: a figure lacking `taxYear`/`source`) is a
> `numbers.ts` audit concern, not a curriculum/lesson concern. Plan 05 covers it with a
> small inline bad-figure object inside the validator's staleness self-test; it is not a
> lesson markdown fixture and so is intentionally not represented as a file here.

## Frontmatter shape

Each `.md` mirrors the real lesson files (`src/content/lessons/*.md`): quoted `id`,
`status: complete`, and (where applicable) a block `sources:` list of `{ label, url }`.
The validator's tiny regex reader only needs `id`, `status`, and `sources:` presence — it
does not need the full lesson-loop frontmatter, so these fixtures keep the rest minimal.
