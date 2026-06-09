---
id: "9.6"
track: 1
phase: 9
order: 6
title: "Bad figure source fixture"
summary: "A figure-bearing lesson whose only source is not IRS/SSA."
status: complete
mechanics: false
lastReviewed: "2026-06-09"
doIt: "Nothing — this is a self-test fixture, not a real lesson."
keepThis: "If the validator fails this file, the IRS/SSA-source clause works."
figures:
  - socialSecurityEmployeeRate
sources:
  - label: "CFPB — interest checking"
    url: "https://www.consumerfinance.gov/ask-cfpb/should-i-get-a-checking-account-that-pays-interest-en-925/"
---

## The situation

This file isolates the IRS/SSA-SOURCE failure: its `figures` key
(`socialSecurityEmployeeRate`) resolves fine (so the key check passes), but its only
source is CFPB — a valid generic source, yet NOT IRS/SSA. A figure lesson must cite
IRS/SSA, so the validator must report `[figures] 9.6` and exit 1.
