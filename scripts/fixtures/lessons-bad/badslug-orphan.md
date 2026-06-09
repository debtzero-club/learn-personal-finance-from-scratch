---
id: "9.3"
track: 1
phase: 9
order: 3
title: "Bad slug + orphan fixture"
summary: "Slug violates ${phase}-${order}-<kebab> and has no well-formed match."
status: complete
mechanics: false
lastReviewed: "2026-06-08"
doIt: "Nothing — fixture."
keepThis: "Triggers the [slug] convention check (and the orphan-md direction)."
sources:
  - label: "IRS — Topic 751"
    url: "https://www.irs.gov/taxtopics/tc751"
---

## The situation

Triggers the **[slug]** convention check: `curriculum.bad.mjs` declares lesson `9.3` with
slug `badslug-orphan`, which does **not** start with `9-3-` and is not of the form
`${phase}-${order}-<kebab>`. Because the slug is malformed, it also stands in for the
**orphan-md** direction — there is no well-formed complete entry this file should map to.
The frontmatter id (`9.3`) and the sources block are valid so this fixture isolates the
slug/orphan failure.
