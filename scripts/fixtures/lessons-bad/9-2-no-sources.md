---
id: "9.2"
track: 1
phase: 9
order: 2
title: "No sources fixture"
summary: "A complete lesson with no sources[] — must be rejected."
status: complete
mechanics: false
lastReviewed: "2026-06-08"
doIt: "Nothing — fixture."
keepThis: "Triggers the [sources] check: complete lesson with zero sources."
---

## The situation

Triggers exactly the **[sources]** check: this lesson is `status: complete` and its `id`
(`9.2`) matches `curriculum.bad.mjs`, and its slug obeys the convention — but it has **no
`sources:` block at all**. Every complete lesson must cite at least one authoritative
source, so the validator must reject this.
