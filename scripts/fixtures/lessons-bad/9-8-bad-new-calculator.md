---
id: "9.8"
track: 1
phase: 9
order: 8
title: "Bad new-calculator fixture"
summary: "A fixture lesson declaring a TYPO'd Phase-4 calculator the validator must reject."
status: complete
mechanics: true
lastReviewed: "2026-06-11"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator rejects this file, a typo'd Phase-4 calculator name fails the build."
calculator: card-intrest
sources:
  - label: "CFPB — Building financial well-being"
    url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/financial-well-being-resources/"
---

## The situation

This file declares `calculator: card-intrest` — a TYPO of the real Phase-4 name
`card-interest`, so it is NOT in REGISTERED_CALCULATORS. It trips ONLY the
`[calculator]` check so the bad fixture exits 1. (Everything else here is valid: id
matches, slug obeys the convention, and it has a source.)
