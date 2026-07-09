---
id: "6.5"
track: 1
phase: 6
order: 5
title: "APR vs. APY — why the same \"rate\" isn't the same number"
summary: "APR is the rate before compounding is folded in; APY is the rate after — the honest number — which is why a 5% APR compounded monthly actually works out to 5.12% APY."
status: complete
mechanics: true
lastReviewed: "2026-06-09"
calculator: apr-apy
doIt: "Find a rate on one of your accounts and check the label: does it say APR or APY? On savings you want to compare by APY; on a card, the APR is your cost. Knowing which one you're looking at is half the battle."
keepThis: "APR is the rate before compounding; APY is the rate after compounding is folded in. 5% APR compounded monthly = 5.12% APY. On savings, compare by APY (the honest number); on debt, your real cost runs a bit above the stated APR for the same reason."
quiz:
  - q: "What's the difference between APR and APY?"
    options:
      - "APR is for savings, APY is for loans"
      - "APR is the rate before compounding is folded in; APY is the rate after compounding"
      - "They're identical"
      - "APY is always lower than APR"
    answer: 1
    explain: "APR is the stated annual rate before you account for compounding within the year. APY rolls the compounding in, so it reflects what you actually earn (or, on the cost side, what it effectively works out to). APY is the more honest number."
  - q: "A savings account advertises a 5% rate compounded monthly. What's the APY?"
    options:
      - "Exactly 5.00%"
      - "About 5.12%"
      - "About 4.88%"
      - "About 10%"
    answer: 1
    explain: "Compounding monthly means you earn a little interest on your interest each month, so the effective yearly yield is slightly above 5% — about 5.12% APY. That's the number the calculator below shows."
  - q: "Why does the same 5% rate become a bigger APY when it compounds more often?"
    options:
      - "Because the bank changes the rate"
      - "Because more frequent compounding means interest starts earning interest sooner and more often"
      - "Because APY ignores compounding"
      - "It doesn't — frequency makes no difference"
    answer: 1
    explain: "The more often interest is added, the sooner it starts earning its own interest. So 5% compounded daily yields a touch more than 5% compounded monthly, which yields more than 5% compounded once a year. Same nominal rate, different APY."
  - q: "When comparing two savings accounts, which number should you compare?"
    options:
      - "The APR, because it's always bigger"
      - "The APY, because it already includes the effect of compounding"
      - "Whichever the bank lists first"
      - "Neither — just pick the bigger bank"
    answer: 1
    explain: "APY is the apples-to-apples number for savings: it bakes in the compounding, so a higher APY genuinely means more money. Comparing raw rates with different compounding can mislead you."
sources:
  - label: "CFPB — What is the difference between a loan interest rate and the APR?"
    url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/"
  - label: "CFPB — Regulation DD (Truth in Savings), Appendix A: APY calculation"
    url: "https://www.consumerfinance.gov/rules-policy/regulations/1030/a/"
---

# APR vs. APY — why the same "rate" isn't the same number

> APR is the rate before compounding is folded in; APY is the rate after — the honest number — which is why a 5% APR compounded monthly actually works out to 5.12% APY.

## The situation

You're comparing two savings accounts. One brags about a "5% rate," the other advertises a "5.1% APY." A card offer quotes a "24.99% APR." Three numbers, three different little acronyms, and a nagging feeling that they're not quite measuring the same thing. They're not — and once you know which is which, you can compare any two offers honestly instead of guessing.

## The idea

Both APR and APY describe a yearly rate. The difference is **whether compounding is baked in.**

- **APR — Annual Percentage Rate.** The rate *before* compounding is folded in. It's the headline number you'll usually see on **borrowing** — credit cards, loans. Think of it as the raw yearly rate.
- **APY — Annual Percentage Yield.** The rate *after* compounding is folded in. It's the number you'll usually see on **savings**, and it reflects what you actually earn once interest starts earning interest across the year. **APY is the honest number.**

Why are they different at all? Because of the snowball you just saw. If a 5% rate compounds *monthly*, you earn a little interest on your interest each month — so by the end of the year you've actually earned slightly *more* than a flat 5%. APY captures that "slightly more." The more often it compounds, the bigger the gap between the stated rate and the true yield.

**The rule of thumb: on savings, compare by APY — it already includes compounding. On debt, the APR is the headline, but your real cost runs a touch *higher* than the stated APR for the very same reason.** (That second half threads straight into the next lesson, where the same engine becomes the enemy.)

## By the numbers

Take the cleanest case: a **5% rate, compounded monthly.** What's the true yearly yield?

Each month earns one-twelfth of 5%, but because each month's interest joins the balance and then earns interest itself, the twelve months stack up to a little more than 5%:

| Same 5% rate, compounded... | Works out to (APY) |
| --- | --- |
| Once a year | 5.00% |
| **Monthly** | **5.12%** |
| Daily | about 5.13% |

That's the headline: **5% APR compounded monthly = 5.12% APY.** Not a huge gap on a small balance for one year — but it's the *honest* comparison number, and on big balances over many years it adds up exactly the way the snowball does. Notice, too, that compounding *daily* nudges it a hair higher still (about 5.13%): same nominal rate, more frequent compounding, slightly bigger yield.

The calculator below starts on this exact case — **5% APR, monthly, showing 5.12% APY.** Change the rate or the compounding frequency and watch the APY shift. Flip it to daily and see it tick up; flip it to yearly and watch it collapse back to the plain rate. Same rate, different honest number — that's the entire idea, live.

## Where this fits

APR and APY aren't bank tricks; they're just two honest ways to quote the same engine — one before compounding, one after. On savings you hunt for the highest APY. On debt you respect the APR and remember the real cost is a bit steeper. Keep both straight and no rate label can fool you. Next: the two faces of this engine — the same compounding that grows your savings is what makes debt so hard to escape.

<p class="lesson-md-nav"><a href="./6-4-the-rule-of-72.md">← 6.4 The Rule of 72: how fast money doubles</a> · <a href="../../../README.md#curriculum">Contents</a> · <a href="./6-6-fixed-vs-variable-rates.md">6.6 Fixed vs. variable rates — what changes, and when it bites →</a></p>
