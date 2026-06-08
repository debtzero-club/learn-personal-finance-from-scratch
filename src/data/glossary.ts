/**
 * Plain-English glossary. Starter set — grow it as lessons land.
 * Keep definitions to 1–2 sentences, jargon-free, US-specific.
 */
export interface Term {
  term: string;
  def: string;
  related?: string[]; // lesson ids, e.g. "6.2"
}

export const glossary: Term[] = [
  { term: 'APR (Annual Percentage Rate)', def: 'The yearly cost of borrowing money, shown as a percentage. On a credit card, your APR divided by 365 is roughly what you are charged per day on a balance.', related: ['6.5', '7.4'] },
  { term: 'APY (Annual Percentage Yield)', def: 'The yearly amount you earn on savings, including the effect of compounding. A higher APY means your money grows faster.', related: ['6.5'] },
  { term: 'Compound interest', def: 'Interest calculated on your original money plus the interest already added. It is why savings snowball over time — and why debt can spiral.', related: ['6.2', '6.3'] },
  { term: 'Simple interest', def: 'Interest calculated only on the original amount, never on interest already added.', related: ['6.2'] },
  { term: 'Principal', def: 'The original amount of money you borrowed or invested, before any interest.', related: ['8.2'] },
  { term: 'Gross pay', def: 'Your salary before any taxes or deductions are taken out.', related: ['2.1'] },
  { term: 'Net pay', def: 'Your take-home pay — what actually lands in your account after taxes and deductions.', related: ['2.1'] },
  { term: 'FICA', def: 'Payroll taxes for Social Security and Medicare, automatically taken from your paycheck (7.65% of pay for most employees).', related: ['2.3'] },
  { term: 'W-4', def: 'The form you give your employer that tells them how much tax to withhold from each paycheck.', related: ['2.4'] },
  { term: 'W-2', def: 'The year-end form from your employer summarizing what you earned and what taxes were withheld. You use it to file your tax return.', related: ['2.5'] },
  { term: 'Emergency fund', def: 'Money set aside only for unexpected costs (a car repair, a medical bill, a lost job). A starter goal is $1,000; a fuller goal is 3–6 months of expenses.', related: ['5.1', '5.2'] },
  { term: 'High-yield savings account (HYSA)', def: 'A savings account that pays meaningfully more interest than a typical big-bank savings account, usually online.', related: ['3.3'] },
  { term: 'Credit score', def: 'A number (commonly 300–850) that lenders use to judge how reliably you repay debt. Higher is better and means cheaper borrowing.', related: ['7.7'] },
  { term: 'Minimum payment', def: 'The smallest amount you can pay on a credit card to stay current. Paying only the minimum keeps you in debt for years and maximizes interest.', related: ['7.5'] },
  { term: 'Grace period', def: 'The window between your credit card statement date and due date. Pay the full statement balance within it and you owe zero interest.', related: ['7.3'] },
  { term: 'Amortization', def: 'How a loan is paid off over time in equal payments. Early payments are mostly interest; later payments are mostly principal.', related: ['8.3'] },
  { term: '401(k) match', def: 'Free money: when your employer adds to your retirement account based on what you contribute, up to a limit. Always try to contribute enough to get the full match.', related: ['10.2'] },
  { term: 'Roth account', def: 'A retirement account you fund with money you have already paid tax on, so qualified withdrawals in retirement are tax-free.', related: ['10.3'] },
  { term: 'Index fund', def: 'A low-cost investment that holds a little of many companies at once, tracking the whole market instead of betting on single stocks.', related: ['14.3'] },
];
