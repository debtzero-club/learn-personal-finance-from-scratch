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
  { term: 'APY (Annual Percentage Yield)', def: 'The yearly amount you earn on savings, including the effect of compounding. A higher APY means your money grows faster.', related: ['3.3', '6.5'] },
  { term: 'Compound interest', def: 'Interest calculated on your original money plus the interest already added. It is why savings snowball over time — and why debt can spiral.', related: ['6.2', '6.3'] },
  { term: 'Simple interest', def: 'Interest calculated only on the original amount, never on interest already added.', related: ['6.2'] },
  { term: 'Principal', def: 'The original amount of money you borrowed or invested, before any interest.', related: ['8.2'] },
  { term: 'Gross pay', def: 'Your salary before any taxes or deductions are taken out.', related: ['2.1', '2.2'] },
  { term: 'Net pay', def: 'Your take-home pay — what actually lands in your account after taxes and deductions.', related: ['2.1', '2.2', '4.2', '4.3'] },
  { term: 'FICA', def: 'Payroll taxes for Social Security and Medicare, automatically taken from your paycheck (7.65% of pay for most employees).', related: ['2.3', '2.2', '2.5'] },
  { term: 'W-4', def: 'The form you give your employer that tells them how much tax to withhold from each paycheck.', related: ['2.4', '2.7'] },
  { term: 'W-2', def: 'The year-end form from your employer summarizing what you earned and what taxes were withheld. You use it to file your tax return.', related: ['2.5', '2.6'] },
  { term: 'Emergency fund', def: 'Money set aside only for unexpected costs (a car repair, a medical bill, a lost job). A starter goal is $1,000; a fuller goal is 3–6 months of expenses.', related: ['5.1', '5.2'] },
  { term: 'High-yield savings account (HYSA)', def: 'A savings account that pays meaningfully more interest than a typical big-bank savings account, usually online.', related: ['3.3'] },
  { term: 'Credit score', def: 'A number (commonly 300–850) that lenders use to judge how reliably you repay debt. Higher is better and means cheaper borrowing.', related: ['7.7'] },
  { term: 'Minimum payment', def: 'The smallest amount you can pay on a credit card to stay current. Paying only the minimum keeps you in debt for years and maximizes interest.', related: ['7.5'] },
  { term: 'Grace period', def: 'The window between your credit card statement date and due date. Pay the full statement balance within it and you owe zero interest.', related: ['7.3'] },
  { term: 'Amortization', def: 'How a loan is paid off over time in equal payments. Early payments are mostly interest; later payments are mostly principal.', related: ['8.3'] },
  { term: '401(k) match', def: 'Free money: when your employer adds to your retirement account based on what you contribute, up to a limit. Always try to contribute enough to get the full match.', related: ['10.2'] },
  { term: 'Roth account', def: 'A retirement account you fund with money you have already paid tax on, so qualified withdrawals in retirement are tax-free.', related: ['10.3'] },
  { term: 'Index fund', def: 'A low-cost investment that holds a little of many companies at once, tracking the whole market instead of betting on single stocks.', related: ['14.3'] },
  { term: 'Withholding', def: 'The federal (and state) income tax your employer takes out of each paycheck and sends to the government on your behalf, based on your W-4.', related: ['2.4', '2.1', '2.7'] },
  { term: 'Standard deduction', def: 'A flat amount of income the IRS lets you subtract before figuring your tax — $16,100 for a single filer in 2026. Most first-job filers take it instead of itemizing.', related: ['2.6'] },
  { term: 'Marginal vs. effective tax rate', def: 'Your marginal rate is the rate on your next dollar earned (your top bracket); your effective rate is the average across all your income, which is always lower. A raise into a higher bracket only taxes the new dollars, never your whole income.', related: ['2.1'] },
  { term: '1099 / Independent contractor', def: 'A worker who is paid in full with no taxes withheld and reported on a 1099 form. Contractors owe both halves of FICA (15.3% self-employment tax) and pay quarterly estimated taxes themselves.', related: ['2.5'] },
  { term: 'Tax refund vs. liability', def: 'Your liability is the tax you actually owe for the year; a refund is just money returned when your withholding was more than that liability. A refund is your own money back, not a bonus.', related: ['2.6', '2.7'] },
  { term: 'Social Security wage base', def: 'The annual wage ceiling above which the 6.2% Social Security tax stops applying — $184,500 in 2026. Medicare tax has no such cap.', related: ['2.3'] },
  { term: 'Overdraft', def: 'Spending more than your checking balance. With overdraft "coverage" turned on, the bank lets the charge through and hits you with a flat fee (often about $35); turn it off and the card simply declines instead.', related: ['3.5'] },
  { term: 'Two-factor authentication (2FA)', def: 'A second login step beyond your password — usually a code from an app or a tap on your phone — so a stolen password alone can\'t get into your account. Use an authenticator app over text-message codes where you can.', related: ['3.6'] },
  { term: 'Credit freeze', def: 'A free, reversible lock you place on your credit file with the credit bureaus. It blocks new accounts from being opened in your name, which stops most identity theft; you lift it temporarily when you actually apply for credit.', related: ['3.6'] },
  { term: 'FDIC insurance', def: 'Federal protection that guarantees the money in your bank deposit accounts (up to the legal limit) even if the bank fails. Look for "FDIC-insured" when choosing a bank — credit unions have equivalent NCUA coverage.', related: ['3.1', '3.3', '3.6'] },
  { term: 'Direct deposit', def: 'Having your paycheck sent electronically straight into your bank account instead of as a paper check. It is faster, free, and often the easiest way a bank will waive a monthly account fee.', related: ['3.1', '3.2', '4.4'] },
  { term: '50/30/20', def: 'A simple starter budget that splits your take-home pay into 50% needs, 30% wants, and 20% saving and debt. Treat the percentages as a starting point you adjust to your real life, not a fixed rule.', related: ['4.2'] },
  { term: 'Pay yourself first', def: 'The habit of moving money into savings on payday, before you spend on anything else — like a bill owed to your future self. It beats saving "whatever is left over," which is usually nothing.', related: ['4.3', '4.4'] },
  { term: 'Sinking fund', def: 'Money you set aside a little each month for a known, irregular cost that you can see coming (like annual car insurance or the holidays). Dividing a big once-a-year bill by 12 turns it into a calm monthly habit instead of a budget shock.', related: ['4.5'] },
];
