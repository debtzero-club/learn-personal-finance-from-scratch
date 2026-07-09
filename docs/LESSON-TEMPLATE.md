# Lesson template

Copy the frontmatter + structure below into a new file at
`src/content/lessons/<phase>-<order>-<kebab-title>.md`, then fill it in.
Delete these instructions. See `src/content/lessons/1-1-what-this-course-is.md` for a real example.

```markdown
---
id: "2.1"                         # must match the id in src/data/curriculum.ts
track: 1                          # 1 = Foundations, 2 = Real-Life Money
phase: 2
order: 1                          # position within the phase
title: "Gross vs. net: why your paycheck is smaller than your salary"
summary: "One-sentence promise of what the reader will understand after this lesson."
status: complete                  # complete | draft | planned
mechanics: false                  # true for ⚙ "how it actually works" lessons
lastReviewed: "2026-06-07"        # ISO date — update when you verify the numbers
doIt: "The ONE concrete action the reader takes right now."
keepThis: "The single number or takeaway to remember."
quiz:
  - q: "A short recall question?"
    options:
      - "Wrong but plausible"
      - "Correct answer"
      - "Another wrong one"
    answer: 1                     # index of the correct option (0-based)
    explain: "One sentence on why."
  - q: "A second question (aim for 3–5 total)?"
    options: ["Yes", "No"]
    answer: 0
    explain: "Why."
sources:
  - label: "IRS — Tax withholding"
    url: "https://www.irs.gov/individuals/tax-withholding-estimator"
---

# Gross vs. net: why your paycheck is smaller than your salary

> One-sentence promise of what the reader will understand after this lesson.

## The situation

A real money moment, 1–2 sentences. Make the reader feel seen.

## The idea

One concept, in plain language. **Bold the rule of thumb.** Define any new term.

## By the numbers

A worked example with real US figures. Use a table for comparisons. For ⚙ lessons, this is where an
interactive calculator goes (build as a small Astro component).

## (Optional extra section)

A short reframe, a "where this fits", or a pointer to the next lesson by id.

<p class="lesson-md-nav"><a href="./2-0-prev-slug.md">← 2.0 Previous lesson</a> · <a href="../../../README.md#curriculum">Contents</a> · <a href="./2-2-next-slug.md">2.2 Next lesson →</a></p>
```

> **Don't hand-write the `# <title>` header, the `> <summary>` blockquote, or the
> `<p class="lesson-md-nav">` footer.** They are GitHub-only reading aids (the live
> site strips them via `src/lib/rehype-github-extras.mjs`). Run
> `npm run sync:github-extras` and they're generated/updated from the frontmatter and
> `curriculum.ts` order automatically.

## Checklist before you open a PR
- [ ] One concept only; ~3–5 minutes to read.
- [ ] Ends in a real action (`doIt`).
- [ ] 3–5 quiz questions with explanations.
- [ ] Plain language, no undefined jargon, no shame, US-specific.
- [ ] Numbers are sourced (IRS/CFPB/SSA/Fed/FINRA) and `lastReviewed` is set.
- [ ] `curriculum.ts` updated: `status: 'complete'` + `slug` added.
- [ ] `npm run build` passes.
