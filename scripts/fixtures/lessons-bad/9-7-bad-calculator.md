---
id: "9.7"
track: 1
phase: 9
order: 7
title: "Bad calculator fixture"
summary: "A fixture lesson declaring an UNREGISTERED calculator the validator must reject."
status: complete
mechanics: true
lastReviewed: "2026-06-08"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator rejects this file, the calculator name-check fails the build on a typo."
calculator: notacalc
sources:
  - label: "CFPB — Building financial well-being"
    url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/financial-well-being-resources/"
---

## The situation

This file declares `calculator: notacalc` — a name that is NOT in
REGISTERED_CALCULATORS. It trips ONLY the new `[calculator]` check so the bad
fixture exits 1. (Everything else here is valid: id matches, slug obeys the
convention, and it has a source.)
