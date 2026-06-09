---
id: "9.5"
track: 1
phase: 9
order: 5
title: "Bad figure key fixture"
summary: "A figure-bearing lesson whose one figures key does not resolve."
status: complete
mechanics: false
lastReviewed: "2026-06-09"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator fails this file, the figures-key check works."
figures:
  - notARealKey
sources:
  - label: "IRS Topic 751"
    url: "https://www.irs.gov/taxtopics/tc751"
---

## The situation

This file isolates the figures-KEY failure: it carries a VALID IRS source (so the
IRS/SSA-source clause passes) but its only `figures` key, `notARealKey`, does not
resolve in numbers.ts — so the validator must report `[figures] 9.5` and exit 1.
