/**
 * MASTER TABLE OF CONTENTS — the single source of truth for the course outline.
 *
 * Every page (home contents, catalog, roadmap) reads from this file.
 * - status: 'complete'  -> a markdown file exists at src/content/lessons/<slug>.md and the lesson links.
 * - status: 'planned'   -> not written yet; shows in the catalog/roadmap but does not link.
 * - mechanics: true      -> a ⚙ "how it actually works" lesson (the credibility spine).
 *
 * To author a planned lesson (see CLAUDE.md):
 *   1) create src/content/lessons/<slug>.md  (slug convention: `${phase}-${order}-<kebab-title>`)
 *   2) here, set that lesson's status to 'complete' and fill in its `slug`.
 */

export type LessonStatus = 'complete' | 'draft' | 'planned';

export interface Lesson {
  id: string; // "1.1"
  order: number;
  title: string;
  slug?: string; // present when status is 'complete' or 'draft'
  status: LessonStatus;
  mechanics?: boolean;
}

export interface Phase {
  phase: number;
  title: string;
  blurb: string;
  lessons: Lesson[];
}

export interface Track {
  track: number;
  name: string;
  tagline: string;
  phases: Phase[];
}

export const curriculum: Track[] = [
  {
    track: 1,
    name: 'Foundations',
    tagline: 'Start here — money from your first paycheck.',
    phases: [
      {
        phase: 1,
        title: 'How Money Works',
        blurb: 'Mindset and goals. The whole course in one map.',
        lessons: [
          { id: '1.1', order: 1, title: "What this course is (and isn't)", slug: '1-1-what-this-course-is', status: 'complete' },
          { id: '1.2', order: 2, title: "Why money feels confusing — and why it's not your fault", slug: '1-2-why-money-feels-confusing', status: 'complete' },
          { id: '1.3', order: 3, title: 'Needs, wants, and the cost of "later"', slug: '1-3-needs-wants-and-the-cost-of-later', status: 'complete' },
          { id: '1.4', order: 4, title: "Setting a money goal you'll actually hit", slug: '1-4-setting-a-money-goal', status: 'complete' },
          { id: '1.5', order: 5, title: 'The 5 money moves that matter most', slug: '1-5-the-5-money-moves', status: 'complete' },
          { id: '1.6', order: 6, title: 'Your money snapshot: where am I right now?', slug: '1-6-your-money-snapshot', status: 'complete' },
        ],
      },
      {
        phase: 2,
        title: 'Your Paycheck & First Taxes',
        blurb: 'Why your paycheck is smaller than your salary — and what to do about it.',
        lessons: [
          { id: '2.1', order: 1, title: 'Gross vs. net: why your paycheck is smaller than your salary', status: 'planned' },
          { id: '2.2', order: 2, title: 'Reading a pay stub, line by line', status: 'planned' },
          { id: '2.3', order: 3, title: "FICA, Social Security & Medicare — what's actually taken out", status: 'planned' },
          { id: '2.4', order: 4, title: 'The W-4: telling your employer how much tax to hold back', status: 'planned' },
          { id: '2.5', order: 5, title: 'W-2 vs. 1099 — which one are you?', status: 'planned' },
          { id: '2.6', order: 6, title: 'Your first tax return, demystified', status: 'planned' },
          { id: '2.7', order: 7, title: "Why a big refund isn't the win it feels like", status: 'planned' },
        ],
      },
      {
        phase: 3,
        title: 'Banking Without Getting Robbed (by fees)',
        blurb: 'Accounts, fees, and keeping your money safe.',
        lessons: [
          { id: '3.1', order: 1, title: 'Checking vs. savings — what each is for', status: 'planned' },
          { id: '3.2', order: 2, title: 'The account fees quietly draining you', status: 'planned' },
          { id: '3.3', order: 3, title: 'High-yield savings: same money, more of it', status: 'planned' },
          { id: '3.4', order: 4, title: "Debit vs. credit — what's really happening", status: 'planned' },
          { id: '3.5', order: 5, title: 'Beating overdraft and the $35 coffee', status: 'planned' },
          { id: '3.6', order: 6, title: 'Keeping your money safe (fraud, scams, 2FA)', status: 'planned' },
        ],
      },
      {
        phase: 4,
        title: "Budgeting That Doesn't Suck",
        blurb: 'A budget that runs on automation, not willpower.',
        lessons: [
          { id: '4.1', order: 1, title: 'Where did my money go? (tracking, painlessly)', status: 'planned' },
          { id: '4.2', order: 2, title: 'The 50/30/20 starting point', status: 'planned' },
          { id: '4.3', order: 3, title: 'Pay yourself first — the one habit that does the work', status: 'planned' },
          { id: '4.4', order: 4, title: "Automating your money so willpower isn't the plan", status: 'planned' },
          { id: '4.5', order: 5, title: 'Sinking funds: saving for what you know is coming', status: 'planned' },
          { id: '4.6', order: 6, title: 'The 24-hour rule and other anti-impulse tricks', status: 'planned' },
          { id: '4.7', order: 7, title: 'Budgeting when your income is irregular', status: 'planned' },
        ],
      },
      {
        phase: 5,
        title: 'Saving & Your Safety Net',
        blurb: 'The emergency fund that comes before almost everything.',
        lessons: [
          { id: '5.1', order: 1, title: 'Why an emergency fund comes before almost everything', status: 'planned' },
          { id: '5.2', order: 2, title: 'Your first $1,000 (the starter fund)', status: 'planned' },
          { id: '5.3', order: 3, title: 'How big should my emergency fund be?', status: 'planned' },
          { id: '5.4', order: 4, title: 'Where to actually keep your savings', status: 'planned' },
          { id: '5.5', order: 5, title: 'Saving for goals: short, medium, long', status: 'planned' },
        ],
      },
      {
        phase: 6,
        title: 'Interest & Compounding — The Engine',
        blurb: 'The cornerstone. The "complex" concept, made simple — taught once, reused everywhere.',
        lessons: [
          { id: '6.1', order: 1, title: 'Interest, the simplest version: money that grows, or costs, over time', status: 'planned' },
          { id: '6.2', order: 2, title: 'Simple vs. compound interest — the difference that changes your life', status: 'planned', mechanics: true },
          { id: '6.3', order: 3, title: 'Compounding, seen: how a little becomes a lot', status: 'planned', mechanics: true },
          { id: '6.4', order: 4, title: 'The Rule of 72: how fast money doubles', status: 'planned' },
          { id: '6.5', order: 5, title: "APR vs. APY — why the same \"rate\" isn't the same number", status: 'planned', mechanics: true },
          { id: '6.6', order: 6, title: 'Fixed vs. variable rates — what changes, and when it bites', status: 'planned' },
          { id: '6.7', order: 7, title: 'The two faces of compounding: friend when saving, enemy in debt', status: 'planned' },
        ],
      },
      {
        phase: 7,
        title: 'Credit, Decoded',
        blurb: 'How credit cards actually work — statements, interest, and the minimum-payment trap.',
        lessons: [
          { id: '7.1', order: 1, title: 'What credit even is — and why it matters', status: 'planned' },
          { id: '7.2', order: 2, title: 'How a credit card actually works (statement, balance, due date)', status: 'planned', mechanics: true },
          { id: '7.3', order: 3, title: 'The grace period — how to borrow for free (if you do it right)', status: 'planned', mechanics: true },
          { id: '7.4', order: 4, title: 'How card interest is calculated (APR → daily rate → average daily balance)', status: 'planned', mechanics: true },
          { id: '7.5', order: 5, title: "The minimum-payment trap — how it's calculated and why it keeps you paying", status: 'planned', mechanics: true },
          { id: '7.6', order: 6, title: 'Fees, cash advances & penalty APR — the expensive fine print', status: 'planned' },
          { id: '7.7', order: 7, title: 'Your credit score: what actually moves it', status: 'planned' },
          { id: '7.8', order: 8, title: 'How to build credit from zero', status: 'planned' },
          { id: '7.9', order: 9, title: 'Using a credit card without getting burned', status: 'planned' },
          { id: '7.10', order: 10, title: 'Buy Now, Pay Later (Klarna, Afterpay) — how it really works', status: 'planned', mechanics: true },
          { id: '7.11', order: 11, title: 'Checking your credit report (free) and fixing errors', status: 'planned' },
        ],
      },
    ],
  },
  {
    track: 2,
    name: 'Real-Life Money',
    tagline: 'Debt, big decisions, and building.',
    phases: [
      {
        phase: 8,
        title: 'Getting Out of Debt (+ How Loans Work)',
        blurb: 'Loan mechanics, debt types, and a plan to pay it down.',
        lessons: [
          { id: '8.1', order: 1, title: 'The types of debt, and how each works (revolving vs. installment, secured vs. unsecured)', status: 'planned', mechanics: true },
          { id: '8.2', order: 2, title: 'How a loan actually works: principal, interest, term', status: 'planned', mechanics: true },
          { id: '8.3', order: 3, title: 'Amortization — why your early payments are almost all interest', status: 'planned', mechanics: true },
          { id: '8.4', order: 4, title: 'Good debt, bad debt, and the line between', status: 'planned' },
          { id: '8.5', order: 5, title: 'Why minimum payments cost so much (the 27-year problem)', status: 'planned', mechanics: true },
          { id: '8.6', order: 6, title: 'Avalanche vs. snowball — two ways to pay it down', status: 'planned' },
          { id: '8.7', order: 7, title: 'Why extra payments crush a loan — and where to aim them', status: 'planned', mechanics: true },
          { id: '8.8', order: 8, title: 'Putting every debt in one place (your payoff picture)', status: 'planned' },
          { id: '8.9', order: 9, title: 'Should I consolidate or refinance?', status: 'planned' },
          { id: '8.10', order: 10, title: 'Payday loans & predatory debt — what to avoid and why', status: 'planned' },
          { id: '8.11', order: 11, title: 'Dealing with debt in collections', status: 'planned' },
          { id: '8.12', order: 12, title: 'Staying out of debt for good', status: 'planned' },
        ],
      },
      {
        phase: 9,
        title: 'Student Loans (US)',
        blurb: 'Know what you have, and how to pay it back without overpaying.',
        lessons: [
          { id: '9.1', order: 1, title: 'Federal vs. private — know what you have', status: 'planned' },
          { id: '9.2', order: 2, title: 'How student loan interest works (and capitalization)', status: 'planned', mechanics: true },
          { id: '9.3', order: 3, title: 'Repayment plans, explained (income-driven & standard)', status: 'planned' },
          { id: '9.4', order: 4, title: 'Forgiveness programs (PSLF and friends)', status: 'planned' },
          { id: '9.5', order: 5, title: 'Should you refinance your student loans?', status: 'planned' },
        ],
      },
      {
        phase: 10,
        title: 'Free Money at Work (Benefits)',
        blurb: "The 401(k) match, Roth vs. traditional, HSAs — the stuff nobody explains.",
        lessons: [
          { id: '10.1', order: 1, title: 'Your benefits packet, decoded', status: 'planned' },
          { id: '10.2', order: 2, title: "The 401(k) match — don't leave free money behind", status: 'planned' },
          { id: '10.3', order: 3, title: 'Roth vs. traditional, in plain English', status: 'planned' },
          { id: '10.4', order: 4, title: 'HSAs and FSAs — the accounts nobody explains', status: 'planned' },
          { id: '10.5', order: 5, title: 'Open enrollment without the panic', status: 'planned' },
        ],
      },
      {
        phase: 11,
        title: 'Taxes, A Bit Deeper',
        blurb: 'Deductions, credits, side income, and paying less (legally).',
        lessons: [
          { id: '11.1', order: 1, title: 'Deductions vs. credits — and which beat which', status: 'planned' },
          { id: '11.2', order: 2, title: 'The standard deduction and when to itemize', status: 'planned' },
          { id: '11.3', order: 3, title: 'Side income & 1099s — what you owe', status: 'planned' },
          { id: '11.4', order: 4, title: 'Tax-advantaged accounts recap — how to legally pay less', status: 'planned' },
          { id: '11.5', order: 5, title: 'When to DIY vs. get a pro', status: 'planned' },
        ],
      },
      {
        phase: 12,
        title: 'Protecting Yourself (Insurance & Risk)',
        blurb: 'The cheap protection most people skip.',
        lessons: [
          { id: '12.1', order: 1, title: 'What insurance is really for', status: 'planned' },
          { id: '12.2', order: 2, title: 'Health insurance basics (premium, deductible, out-of-pocket)', status: 'planned' },
          { id: '12.3', order: 3, title: 'Renters & auto insurance — cheap protection you skip', status: 'planned' },
          { id: '12.4', order: 4, title: 'Do I need life insurance yet?', status: 'planned' },
          { id: '12.5', order: 5, title: 'Identity theft and your financial safety', status: 'planned' },
        ],
      },
      {
        phase: 13,
        title: 'Big Money Decisions',
        blurb: 'Renting, cars, moving, and the someday-home conversation.',
        lessons: [
          { id: '13.1', order: 1, title: 'Renting: leases, deposits, roommates', status: 'planned' },
          { id: '13.2', order: 2, title: 'Buying a car without overpaying', status: 'planned' },
          { id: '13.3', order: 3, title: 'Moving out / moving cities, money-wise', status: 'planned' },
          { id: '13.4', order: 4, title: 'The home-buying conversation (someday, not scary)', status: 'planned' },
          { id: '13.5', order: 5, title: 'Big purchases: how to decide', status: 'planned' },
        ],
      },
      {
        phase: 14,
        title: 'Growing Your Money',
        blurb: 'Investing & retirement — the basics, kept light on purpose.',
        lessons: [
          { id: '14.1', order: 1, title: 'Why investing matters (compounding, now working for you)', status: 'planned' },
          { id: '14.2', order: 2, title: 'Risk, time, and why beginners overthink it', status: 'planned' },
          { id: '14.3', order: 3, title: 'Index funds: the boring answer that works', status: 'planned' },
          { id: '14.4', order: 4, title: 'Retirement accounts recap (401k, IRA, Roth)', status: 'planned' },
          { id: '14.5', order: 5, title: 'Your first investment, step by step', status: 'planned' },
          { id: '14.6', order: 6, title: 'Avoiding hype, scams, and "get rich quick"', status: 'planned' },
        ],
      },
    ],
  },
];

// --- small helpers used across pages ---
export const allLessons = (): (Lesson & { track: number; phase: number; phaseTitle: string })[] =>
  curriculum.flatMap((t) =>
    t.phases.flatMap((p) =>
      p.lessons.map((l) => ({ ...l, track: t.track, phase: p.phase, phaseTitle: p.title }))
    )
  );

export const counts = () => {
  const all = allLessons();
  return { total: all.length, complete: all.filter((l) => l.status === 'complete').length };
};
