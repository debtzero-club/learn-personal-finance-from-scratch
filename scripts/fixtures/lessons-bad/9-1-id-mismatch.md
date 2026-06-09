---
id: "9.9"
track: 1
phase: 9
order: 1
title: "Id mismatch fixture"
summary: "Frontmatter id is 9.9 but curriculum.bad.mjs says this slug is 9.1."
status: complete
mechanics: false
lastReviewed: "2026-06-08"
doIt: "Nothing — fixture."
keepThis: "Triggers the [id] check: frontmatter id != curriculum id."
sources:
  - label: "IRS — Topic 751"
    url: "https://www.irs.gov/taxtopics/tc751"
---

## The situation

Triggers exactly the **[id] mismatch** check: the slug `9-1-id-mismatch` is declared as
`id: "9.1"` in `curriculum.bad.mjs`, but this file's frontmatter says `id: "9.9"`.
Everything else (slug convention, sources presence) is valid, so this fixture isolates
the id check.
