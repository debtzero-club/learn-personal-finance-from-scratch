// payoff.ts — the multi-debt avalanche-vs-snowball payoff engine (CALC-06).
//
// This is the both-methods comparison behind lesson 8.6 ("avalanche vs snowball") and the
// payoff picture referenced in 8.8. It simulates paying off a small set of debts two ways
// and reports each method's months-to-debt-free + total interest, so the lesson can show
// the honest tradeoff: avalanche (highest-APR-first) pays the LEAST interest; snowball
// (smallest-balance-first) clears your FIRST debt soonest (the motivation win). PURE and
// framework-free — NO DOM, NO Astro imports — golden-testable, runs identically at build
// time, in the browser, and in Vitest. Shares compound.ts's round-per-period cadence.
//
// THE RULE (docs/CALCULATORS.md §1): money is ALWAYS integer cents, routed through
// money.ts. NEVER do float multiplication on a balance — only each debt's monthly rate is
// a float, and a rate is never money.
//
// THE MODEL (D-08/D-09, verified against CFPB "How to reduce your debt"):
//   The monthly budget is CONSTANT = Σ each debt's ORIGINAL minimum + the extra (the
//   "roll it forward" mechanic — as debts clear, their freed minimums stay in the budget
//   and pile onto the next target). Each month, in this order:
//     1. Interest accrues on every unpaid debt: mulRate(bal, apr/12), round per period.
//     2. Each debt is paid its CURRENT minimum (capped to clear it).
//     3. ALL remaining budget is thrown at the single highest-PRIORITY unpaid debt; if that
//        clears with budget to spare, the remainder cascades to the next priority debt.
//   Per-debt minimum = revolving form, SAME as CALC-04: greater of (interest + 1% of
//   balance) or a $35 floor. (An installment debt may pass an explicit minPayment.)
//
// ⚠️ Pitfall 4 — the DEFAULT 3-debt set must make avalanche ≠ snowball, or the comparison
// teaches nothing. The smallest-balance debt must NOT also be the highest-APR debt. The
// verified divergent set (store $1,200@20% / card $5,000@25.99% / auto $9,000@6%, +$200/mo)
// gives avalanche $2,209.33 vs snowball $2,308.90 — avalanche saves $99.57, snowball clears
// the $1,200 store card first.

import { type Cents, mulRate, add, sub } from '../lib/money';

const ZERO = 0 as Cents;

/** Hard cap on the month loop so pathological input can't infinite-loop. */
const MONTH_GUARD = 1200;

/** Per-debt minimum-payment defaults (the revolving "interest + 1% / $35 floor" form). */
const MIN_FLOOR = 3500 as Cents; // $35.00
const MIN_PCT = 0.01; // 1% of balance

export interface Debt {
  /** Display name (e.g. 'store', 'card', 'auto'). */
  name: string;
  /** Current balance, in integer cents. */
  balance: Cents;
  /** Nominal annual rate (APR) as a decimal, e.g. 0.2599 for 25.99%. */
  apr: number;
  /** Optional fixed minimum (installment debt); omit → revolving min is computed. */
  minPayment?: Cents;
}

export interface MethodResult {
  /** Months until every debt is paid off under this method. */
  months: number;
  /** Total interest paid across all debts over the whole payoff, in integer cents. */
  totalInterest: Cents;
  /** Names of debts in the ORDER they were cleared (first cleared first). */
  order: string[];
}

export interface PayoffResult {
  /** Highest-APR-first (the math-optimal, least-interest path). */
  avalanche: MethodResult;
  /** Smallest-balance-first (clears the first debt soonest — the motivation win). */
  snowball: MethodResult;
}

/** A mutable per-debt slot inside one simulation run. */
interface DebtState {
  name: string;
  balance: Cents;
  apr: number;
  /** The fixed minimum to use each month (revolving = computed lazily; installment = fixed). */
  minPayment?: Cents;
  cleared: boolean;
}

/** This debt's minimum for the current month: fixed if given, else revolving (interest + 1% / floor). */
function monthlyMinimum(d: DebtState, interest: Cents): Cents {
  if (d.minPayment !== undefined) {
    return d.minPayment > d.balance ? d.balance : d.minPayment;
  }
  let min: Cents = add(interest, mulRate(d.balance, MIN_PCT));
  if (min < MIN_FLOOR) min = MIN_FLOOR;
  return min;
}

/**
 * Simulate paying off `debts` in the given priority `order` with a constant monthly budget
 * (Σ original minimums + extra). Returns months, total interest, and the clear order.
 */
function simulate(debts: Debt[], priority: Debt[], extra: Cents): MethodResult {
  // Clone into mutable state, preserving the input order for stable per-month iteration.
  const states: DebtState[] = debts.map((d) => ({
    name: d.name,
    balance: d.balance,
    apr: d.apr,
    minPayment: d.minPayment,
    cleared: false,
  }));
  const byName = new Map(states.map((s) => [s.name, s]));
  // Priority list of state refs (highest priority first), per the chosen method's ordering.
  const order = priority.map((d) => byName.get(d.name)!);

  // The CONSTANT monthly budget: each debt's ORIGINAL minimum (from its starting balance,
  // first month's interest) + the extra. Computed once; it never shrinks as debts clear.
  let budget: Cents = extra;
  for (const s of states) {
    const interest0 = mulRate(s.balance, s.apr / 12);
    budget = add(budget, monthlyMinimum(s, interest0));
  }

  let month = 0;
  let totalInterest: Cents = ZERO;
  const cleared: string[] = [];

  while (states.some((s) => !s.cleared) && month < MONTH_GUARD) {
    month++;

    // 1. Interest accrues on every unpaid debt (round per period, half-up).
    const interestThisMonth = new Map<string, Cents>();
    for (const s of states) {
      if (s.cleared) {
        interestThisMonth.set(s.name, ZERO);
        continue;
      }
      const interest = mulRate(s.balance, s.apr / 12);
      s.balance = add(s.balance, interest);
      totalInterest = add(totalInterest, interest);
      interestThisMonth.set(s.name, interest);
    }

    // 2. Pay each unpaid debt its current minimum (capped to clear it). Track leftover budget.
    let remaining: Cents = budget;
    for (const s of states) {
      if (s.cleared) continue;
      let pay = monthlyMinimum(s, interestThisMonth.get(s.name)!);
      if (pay > s.balance) pay = s.balance;
      if (pay > remaining) pay = remaining; // never overspend the budget
      s.balance = sub(s.balance, pay);
      remaining = sub(remaining, pay);
      if (s.balance <= ZERO && !s.cleared) {
        s.cleared = true;
        cleared.push(s.name);
      }
    }

    // 3. Throw ALL remaining budget at the highest-priority unpaid debt; cascade if it clears.
    for (const s of order) {
      if (remaining <= ZERO) break;
      if (s.cleared) continue;
      let pay = s.balance;
      if (pay > remaining) pay = remaining;
      s.balance = sub(s.balance, pay);
      remaining = sub(remaining, pay);
      if (s.balance <= ZERO && !s.cleared) {
        s.cleared = true;
        cleared.push(s.name);
      }
    }
  }

  return { months: month, totalInterest, order: cleared };
}

/**
 * Compare avalanche (highest-APR-first) vs snowball (smallest-balance-first) payoff of a
 * small fixed debt set with rollover + an optional extra payment. Pure integer-cents math
 * via money.ts; each debt's monthly rate is the only float. See docs/CALCULATORS.md.
 */
export function payoff(p: { debts: Debt[]; extra: Cents }): PayoffResult {
  // Avalanche: highest APR first (tie → smaller balance first).
  const avalancheOrder = [...p.debts].sort((a, b) => b.apr - a.apr || a.balance - b.balance);
  // Snowball: smallest balance first (tie → higher APR first).
  const snowballOrder = [...p.debts].sort((a, b) => a.balance - b.balance || b.apr - a.apr);

  return {
    avalanche: simulate(p.debts, avalancheOrder, p.extra),
    snowball: simulate(p.debts, snowballOrder, p.extra),
  };
}
