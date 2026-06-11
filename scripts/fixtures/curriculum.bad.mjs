// BAD validator fixture — the validator MUST reject this and exit 1.
//
// Mirrors src/data/curriculum.ts export shape. Each complete lesson is engineered to trip
// exactly ONE INFRA-01 check when run against scripts/fixtures/lessons-bad/. See README.md
// for the full check->fixture->exit-code map.
//
//   9.1 -> [id]     frontmatter id "9.9" != curriculum "9.1"  (lessons-bad/9-1-id-mismatch.md)
//   9.2 -> [sources] complete lesson has no sources           (lessons-bad/9-2-no-sources.md)
//   9.3 -> [slug]   slug "badslug-orphan" violates `9-3-<kebab>` AND is an orphan md
//                   (lessons-bad/badslug-orphan.md)
//   9.4 -> [sync]   complete but NO markdown file exists at slug "9-4-missing"
//   9.5 -> [figures] figures: [notARealKey] does not resolve (valid IRS source isolates the key failure)
//                   (lessons-bad/9-5-bad-figure-key.md)
//   9.6 -> [figures] resolvable figures key but only a CFPB source -> figure lesson lacks IRS/SSA source
//                   (lessons-bad/9-6-bad-figure-source.md)
//   9.7 -> [calculator] calculator: notacalc is not a registered calculator
//                   (lessons-bad/9-7-bad-calculator.md)
//   9.8 -> [calculator] calculator: card-intrest (a TYPO of the Phase-4 name card-interest)
//                   is not a registered calculator (lessons-bad/9-8-bad-new-calculator.md)

/** @type {{ track:number, name:string, tagline:string, phases:Array<{phase:number,title:string,blurb:string,lessons:Array<{id:string,order:number,title:string,slug?:string,status:string,mechanics?:boolean}>}> }[]} */
export const curriculum = [
  {
    track: 1,
    name: 'Fixtures (bad)',
    tagline: 'Self-test fixtures only — never shown on the site.',
    phases: [
      {
        phase: 9,
        title: 'Fixture phase (bad)',
        blurb: 'Holds the known-bad validator fixtures, one per check.',
        lessons: [
          // [id] check: markdown frontmatter id is "9.9", curriculum says "9.1".
          { id: '9.1', order: 1, title: 'Id mismatch fixture', slug: '9-1-id-mismatch', status: 'complete' },
          // [sources] check: the markdown for this complete lesson has no sources[].
          { id: '9.2', order: 2, title: 'No sources fixture', slug: '9-2-no-sources', status: 'complete' },
          // [slug] check: slug does not match `9-3-<kebab>`; also doubles as orphan-md
          // (no real entry maps to badslug-orphan.md the "right" way).
          { id: '9.3', order: 3, title: 'Bad slug + orphan fixture', slug: 'badslug-orphan', status: 'complete' },
          // [sync] check: complete but there is intentionally NO file at 9-4-missing.md.
          { id: '9.4', order: 4, title: 'Complete but missing file fixture', slug: '9-4-missing', status: 'complete' },
          // [figures] key check: figures: [notARealKey] does not resolve; a valid IRS source isolates this failure.
          { id: '9.5', order: 5, title: 'Bad figure key fixture', slug: '9-5-bad-figure-key', status: 'complete' },
          // [figures] source check: a resolvable figures key but only a CFPB source -> figure lesson lacks IRS/SSA.
          { id: '9.6', order: 6, title: 'Bad figure source fixture', slug: '9-6-bad-figure-source', status: 'complete' },
          // [calculator] check: calculator: notacalc is not in REGISTERED_CALCULATORS.
          { id: '9.7', order: 7, title: 'Bad calculator fixture', slug: '9-7-bad-calculator', status: 'complete' },
          // [calculator] check: calculator: card-intrest is a TYPO of the Phase-4 name card-interest.
          { id: '9.8', order: 8, title: 'Bad new-calculator fixture', slug: '9-8-bad-new-calculator', status: 'complete' },
        ],
      },
    ],
  },
];

export const allLessons = () =>
  curriculum.flatMap((t) =>
    t.phases.flatMap((p) =>
      p.lessons.map((l) => ({ ...l, track: t.track, phase: p.phase, phaseTitle: p.title }))
    )
  );

export const counts = () => {
  const all = allLessons();
  return { total: all.length, complete: all.filter((l) => l.status === 'complete').length };
};
