---
id: "9.2"
track: 1
phase: 9
order: 2
title: "Good figures fixture"
summary: "A valid figure-bearing lesson the validator must accept."
status: complete
mechanics: false
lastReviewed: "2026-06-09"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator passes this file, the figures happy path works."
figures:
  - socialSecurityEmployeeRate
sources:
  - label: "IRS Topic 751 — FICA rates"
    url: "https://www.irs.gov/taxtopics/tc751"
---

## The situation

This file proves the content-sync validator accepts a `complete` figure-bearing lesson:
its single `figures` key (`socialSecurityEmployeeRate`) resolves to a real leaf in
numbers.ts, and it cites an IRS source — so it contributes to exit 0.
