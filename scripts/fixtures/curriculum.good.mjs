// GOOD validator fixture — the validator MUST accept this and exit 0.
//
// Mirrors the export shape of src/data/curriculum.ts so Plan 05's validator can import
// either `curriculum` (nested Track[]) or `allLessons()` (flattened with track/phase).
// One complete lesson, 9.x range so it never collides with real authored lessons.
//
// Pair: scripts/fixtures/lessons-good/9-1-good-fixture.md (id "9.1", complete, has sources).

/** @type {{ track:number, name:string, tagline:string, phases:Array<{phase:number,title:string,blurb:string,lessons:Array<{id:string,order:number,title:string,slug?:string,status:string,mechanics?:boolean}>}> }[]} */
export const curriculum = [
  {
    track: 1,
    name: 'Fixtures',
    tagline: 'Self-test fixtures only — never shown on the site.',
    phases: [
      {
        phase: 9,
        title: 'Fixture phase',
        blurb: 'Holds the known-good validator fixture.',
        lessons: [
          { id: '9.1', order: 1, title: 'Good fixture', slug: '9-1-good-fixture', status: 'complete' },
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
