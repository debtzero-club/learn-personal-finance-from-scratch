---
id: "9.3"
track: 1
phase: 9
order: 3
title: "Good calculator fixture"
summary: "A valid fixture lesson declaring a REGISTERED calculator the validator must accept."
status: complete
mechanics: true
lastReviewed: "2026-06-08"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator passes this file, the calculator name-check happy path works."
calculator: compound
sources:
  - label: "CFPB — Building financial well-being"
    url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/financial-well-being-resources/"
---

## The situation

This file exists only to prove the content-sync validator accepts a `complete`
lesson that declares a REGISTERED calculator: `calculator: compound` resolves to a
component in the registry, so the `[calculator]` check passes (exit 0).
