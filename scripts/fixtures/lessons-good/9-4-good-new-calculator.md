---
id: "9.4"
track: 1
phase: 9
order: 4
title: "Good new-calculator fixture"
summary: "A valid fixture lesson declaring one of the Phase-4 calculators the validator must accept."
status: complete
mechanics: true
lastReviewed: "2026-06-11"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator passes this file, the Phase-4 calculator allow-list extension works."
calculator: card-interest
sources:
  - label: "CFPB — Building financial well-being"
    url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/financial-well-being-resources/"
---

## The situation

This file exists only to prove the content-sync validator accepts a `complete`
lesson that declares one of the NEW Phase-4 calculators: `calculator: card-interest`
resolves to a component now registered in all three synced places (config.ts z.enum,
LessonLayout CALCULATORS, REGISTERED_CALCULATORS), so the `[calculator]` check passes
(exit 0).
