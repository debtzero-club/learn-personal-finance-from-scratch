---
id: "7.4"
track: 1
phase: 7
order: 4
title: "How card interest is calculated (APR → daily rate → average daily balance)"
summary: "Card interest isn't one yearly charge — it's your APR split into a tiny daily rate, applied to the average balance you carried each day of the cycle, which is why a $5,000 balance costs about $98.63 a month."
status: complete
mechanics: true
lastReviewed: "2026-07-08"
calculator: card-interest
doIt: "Find your card's APR (it's on your statement). Divide it by 365 to see your daily rate, then play with the calculator below to watch what your real average balance costs you each month."
keepThis: "Card interest = your average daily balance × (APR ÷ 365) × days in the cycle. A $5,000 balance at 24% APR costs about $98.63 every single month it sits there — roughly $1,184 a year just to carry it."
quiz:
  - q: "What is the daily periodic rate?"
    options:
      - "Your APR multiplied by 365"
      - "Your APR divided by 365 — the slice of interest charged each day"
      - "A flat $1 per day"
      - "The same as your minimum payment"
    answer: 1
    explain: "The daily periodic rate is just your APR ÷ 365. A 24% APR becomes about 0.0658% per day. Small daily, but it's applied every single day of the cycle on your balance."
  - q: "What does 'average daily balance' mean?"
    options:
      - "Your balance on the first day of the cycle"
      - "Your balance on the last day"
      - "The average of what you owed each day across the whole billing cycle"
      - "Your credit limit"
    answer: 2
    explain: "The card looks at what you owed every single day, adds them up, and divides by the number of days. Interest is charged on that average — not your starting or ending balance."
  - q: "In the calculator, about how much does a $5,000 balance at 24% APR cost for a 30-day cycle (grace OFF)?"
    options:
      - "About $10"
      - "About $98.63"
      - "About $500"
      - "Nothing"
    answer: 1
    explain: "$5,000 × (0.24 ÷ 365) × 30 ≈ $98.63 for the cycle. That's roughly $1,184 a year just to carry the balance — the cost of losing the grace period."
  - q: "If you pay the balance down mid-cycle, why does your interest drop?"
    options:
      - "It doesn't change"
      - "Because the average daily balance falls, so there's less for the daily rate to work on"
      - "Because the APR resets to zero"
      - "Because the bank forgives it"
    answer: 1
    explain: "Interest is charged on the average daily balance. Pay some off partway through and your balance is lower for the remaining days, which pulls the average down — and a lower average means less interest. Paying earlier in the cycle helps more."
sources:
  - label: "CFPB — How does my credit card company calculate the amount of interest I owe?"
    url: "https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/"
  - label: "CFPB — What is a daily periodic rate on a credit card?"
    url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-daily-periodic-rate-on-a-credit-card-en-46/"
  - label: "CFPB — What does it mean if a credit card has a grace period?"
    url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/"
---

# How card interest is calculated (APR → daily rate → average daily balance)

> Card interest isn't one yearly charge — it's your APR split into a tiny daily rate, applied to the average balance you carried each day of the cycle, which is why a $5,000 balance costs about $98.63 a month.

## The situation

Your card says "24% APR." You carry a $5,000 balance for a month. Quick: how much interest do you owe? Most people guess wildly — and the card company is counting on you not knowing. The actual math is completely learnable, and once you see it, that 24% stops being a mystery number and becomes a cost you can predict.

## The idea

This is the same compounding engine from Phase 6 — but now it's running *against* you. Three pieces:

**1. APR → daily periodic rate.** Your **APR** (Annual Percentage Rate) is the yearly cost of borrowing. But cards don't charge once a year — they charge every day. So they split the APR into a **daily periodic rate (DPR): APR ÷ 365.** A 24% APR becomes about **0.0658% per day.** Tiny — but it hits every single day.

**2. Average daily balance.** The card doesn't charge interest on your starting balance or your ending balance. It charges on the **average daily balance (ADB)** — what you owed *each day*, added up and divided by the days in the cycle. Carry $5,000 flat all month and your ADB is $5,000. Pay some down halfway through and the average drops, because your balance was lower for the back half.

**3. Put them together.** The cycle's interest is:

> **average daily balance × daily periodic rate × days in the cycle**

That's it. Average balance, times the daily slice, times the number of days.

**The rule of thumb: a carried balance costs you ADB × (APR ÷ 365) × days — roughly 2% of the balance every month at a 24% APR.** This is the "bucket with a hole." A balance just sitting there leaks interest every day it sits.

One more thing this explains: **why paying earlier in the cycle helps.** Since interest rides on the *average*, knocking the balance down sooner means it's lower for more days, which pulls the average — and the interest — down. Timing matters.

## By the numbers

Here's the calculator from the last lesson, now with the grace toggle **OFF** — you're carrying a balance, so the bucket has a hole. Same $5,000, same 24% APR:

**The scenario:** $5,000 average daily balance, 30-day cycle, 24% APR, grace period lost.

Step by step:

| Step | Math | Result |
| --- | --- | ---: |
| Daily periodic rate | 24% ÷ 365 | ≈ 0.0658% per day |
| Average daily balance | $5,000 carried flat | $5,000.00 |
| Cycle interest | $5,000 × 0.0658% × 30 days | **≈ $98.63** |

That **$98.63** is what one month of carrying $5,000 costs. Keep it up all year and you're paying roughly **$1,184** — and that's before the balance compounds on itself, which it does. You'd be handing the card company about $1,184 a year for the privilege of carrying a balance you could have paid off.

Now play with the calculator. Watch what happens when you add a **payment mid-cycle** — the average daily balance drops, and the interest drops with it, more if the payment lands earlier. Add a **purchase** mid-cycle and the average climbs. This is the live version of "interest rides on the average, and timing matters." The number you saw as $0.00 in the last lesson (grace on) is the same engine — the only difference is whether the hole in the bucket is open.

## Where this fits

You now know exactly what a carried balance costs and why: a daily rate, applied to your average balance, every day. That's the engine. The next lesson points it at the cruelest setting of all — what happens when you pay only the *minimum* and let that engine run for years.

<p class="lesson-md-nav"><a href="./7-3-the-grace-period.md">← 7.3 The grace period — how to borrow for free (if you do it right)</a> · <a href="../../../README.md#curriculum">Contents</a> · <a href="./7-5-the-minimum-payment-trap.md">7.5 The minimum-payment trap — how it's calculated and why it keeps you paying →</a></p>
