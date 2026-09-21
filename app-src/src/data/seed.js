import { CURRENT_PLAN_ID, countByPlan, put, putMany } from './db.js';

/**
 * The plan document's structure as seed data. Mirrors lifestyle-plan.md —
 * when that document changes structurally, change it here too.
 *
 * Placeholders the document leaves blank (`___`) seed as empty strings so the
 * UI shows an empty field to fill rather than literal underscores.
 */

export const PERIODS = [
  { id: 'q4-2026', order: 1, label: 'Q4 2026', start: '2026-10-01', end: '2026-12-31',
    theme: 'Foundation: set budget, define goals, audit skills, year-end review' },
  { id: 'q1-2027', order: 2, label: 'Q1 2027', start: '2027-01-01', end: '2027-03-31',
    theme: 'New year reset, career check-in, budget review' },
  { id: 'q2-2027', order: 3, label: 'Q2 2027', start: '2027-04-01', end: '2027-06-30',
    theme: 'Mid-year push: career development, skill deepening' },
  { id: 'q3-2027', order: 4, label: 'Q3 2027', start: '2027-07-01', end: '2027-09-30',
    theme: 'Consolidate progress, adjust goals' },
  { id: 'q4-2027', order: 5, label: 'Q4 2027', start: '2027-10-01', end: '2027-12-31',
    theme: 'Final push, annual review, plan for 2028' },
];

const VISION = [
  { id: 'vision-financial', order: 1, category: 'Financial', text: '',
    hint: 'e.g. build a 6-month emergency fund, pay down debt, hit a savings target' },
  { id: 'vision-personal', order: 2, category: 'Personal', text: '',
    hint: 'e.g. health/fitness milestone, relationships, hobbies, travel' },
  { id: 'vision-career', order: 3, category: 'Career', text: '',
    hint: 'e.g. promotion, new role, side project launched' },
  { id: 'vision-skills', order: 4, category: 'Skills', text: '',
    hint: 'e.g. a certification, a new language, a technical specialism' },
  { id: 'priority-1', order: 5, category: 'Top priority', text: '', hint: 'Priority 1' },
  { id: 'priority-2', order: 6, category: 'Top priority', text: '', hint: 'Priority 2' },
  { id: 'priority-3', order: 7, category: 'Top priority', text: '', hint: 'Priority 3' },
];

const BUDGET_CATEGORIES = [
  { id: 'bc-essentials', order: 1, name: 'Essentials (rent/mortgage, bills, food)', targetPct: 50, notes: 'Fixed costs' },
  { id: 'bc-savings', order: 2, name: 'Savings & investments', targetPct: 20, notes: 'Emergency fund → investments once fund is full' },
  { id: 'bc-debt', order: 3, name: 'Debt repayment', targetPct: 10, notes: 'Adjust based on outstanding balances' },
  { id: 'bc-discretionary', order: 4, name: 'Discretionary (leisure, hobbies)', targetPct: 15, notes: 'Lifestyle spend' },
  { id: 'bc-growth', order: 5, name: 'Skill/career investment', targetPct: 5, notes: 'Courses, books, certifications, networking' },
];

const FINANCIAL_MILESTONES = [
  { id: 'fm-ef3', order: 1, name: 'Emergency fund (3 months expenses)', targetDate: '2027-03-31',
    targetAmount: null, currentAmount: 0, status: 'not-started' },
  { id: 'fm-ef6', order: 2, name: 'Emergency fund (6 months expenses)', targetDate: '2027-09-30',
    targetAmount: null, currentAmount: 0, status: 'not-started' },
  { id: 'fm-debt', order: 3, name: 'Debt paid off', targetDate: null,
    targetAmount: null, currentAmount: 0, status: 'not-started' },
  { id: 'fm-invest', order: 4, name: 'Investment/savings target', targetDate: '2027-12-31',
    targetAmount: null, currentAmount: 0, status: 'not-started' },
  { id: 'fm-purchase', order: 5, name: 'Big purchase / travel fund', targetDate: null,
    targetAmount: null, currentAmount: 0, status: 'not-started' },
];

const PERSONAL_GOALS = [
  { id: 'pg-exercise', order: 1, area: 'health', text: 'Define a sustainable exercise routine (frequency, type)', done: false, targetDate: null },
  { id: 'pg-nutrition', order: 2, area: 'health', text: 'Nutrition/diet goal', done: false, targetDate: null },
  { id: 'pg-sleep', order: 3, area: 'health', text: 'Sleep/routine goal', done: false, targetDate: null },
  { id: 'pg-mind', order: 4, area: 'health', text: 'Mental health / mindfulness practice', done: false, targetDate: null },
  { id: 'pg-family', order: 5, area: 'relationships', text: 'Time with family/friends — set a regular cadence', done: false, targetDate: null },
  { id: 'pg-social', order: 6, area: 'relationships', text: 'New social activity or community to join', done: false, targetDate: null },
  { id: 'pg-hobby', order: 7, area: 'enrichment', text: 'Hobby to start or deepen', done: false, targetDate: null },
  { id: 'pg-travel', order: 8, area: 'enrichment', text: 'Travel plans (destinations, dates, budget)', done: false, targetDate: null },
  { id: 'pg-reading', order: 9, area: 'enrichment', text: 'Reading/learning goal (non-career)', done: false, targetDate: null },
];

const CAREER_STATE = [
  { id: 'cs-role', order: 1, field: 'Role/title', now: '', target: '' },
  { id: 'cs-responsibilities', order: 2, field: 'Responsibilities', now: '', target: '' },
  { id: 'cs-compensation', order: 3, field: 'Compensation', now: '', target: '' },
  { id: 'cs-strengths', order: 4, field: 'Key strengths', now: '', target: '' },
  { id: 'cs-gaps', order: 5, field: 'Gaps to close', now: '', target: '' },
];

const CAREER_MILESTONES = [
  { id: 'cm-review', order: 1, name: 'Performance review / feedback cycle', targetDate: null,
    notes: 'Every 6 months — track outcomes and set new goals each time', status: 'not-started' },
  { id: 'cm-promotion', order: 2, name: 'Promotion / role change target', targetDate: null, notes: '', status: 'not-started' },
  { id: 'cm-network', order: 3, name: 'Network building (mentors, industry contacts)', targetDate: null,
    notes: 'Ongoing — aim for 1 new meaningful connection/month', status: 'not-started' },
  { id: 'cm-portfolio', order: 4, name: 'Side project / portfolio piece', targetDate: null,
    notes: 'Demonstrates capability for next role', status: 'not-started' },
];

const CAREER_ACTIONS = [
  { id: 'ca-q4-2026', order: 1, periodId: 'q4-2026', done: false,
    text: 'Set a clear career goal with manager/mentor, identify skill gaps, deliver on a visible project; year-end review and 2027 goal-setting' },
  { id: 'ca-q1-2027', order: 2, periodId: 'q1-2027', done: false,
    text: 'Act on feedback from year-end review; begin any certification/training' },
  { id: 'ca-q2-2027', order: 3, periodId: 'q2-2027', done: false,
    text: 'Mid-year progress check; pursue promotion/role conversation if on track' },
  { id: 'ca-q3-2027', order: 4, periodId: 'q3-2027', done: false,
    text: 'Consolidate achievements; update CV/LinkedIn and portfolio' },
  { id: 'ca-q4-2027', order: 5, periodId: 'q4-2027', done: false,
    text: 'Final review of the period; set 2028 career goals' },
];

const SKILL_MILESTONES = [
  { id: 'sm-first', order: 1, text: 'Complete first course/certification', targetDate: null, done: false },
  { id: 'sm-apply', order: 2, text: 'Apply new skill in a real project (work or personal)', targetDate: null, done: false },
  { id: 'sm-second', order: 3, text: 'Complete second skill milestone', targetDate: null, done: false },
  { id: 'sm-review-2026', order: 4, text: 'Year-end skills review', targetDate: '2026-12-31', done: false },
  { id: 'sm-review-2027', order: 5, text: 'Final skills review for the period', targetDate: '2027-12-31', done: false },
];

const REVIEW_DEFINITIONS = [
  { id: 'rd-weekly', order: 1, type: 'weekly', frequency: 'Every week',
    checks: 'Budget vs. actuals, immediate to-dos' },
  { id: 'rd-monthly', order: 2, type: 'monthly', frequency: '1st of month',
    checks: 'Progress on goals, reconcile accounts, adjust budget' },
  { id: 'rd-quarterly', order: 3, type: 'quarterly', frequency: 'End of each quarter',
    checks: 'Full review of all four areas (budget, personal, career, skills)' },
  { id: 'rd-annual', order: 4, type: 'annual', frequency: 'December 2026, December 2027',
    checks: 'Full plan reset and re-prioritisation' },
];

/**
 * Write the plan's default structure, but only into empty stores — so this is
 * safe to call on every load and never overwrites edits.
 */
export async function seedIfEmpty() {
  const existing = await countByPlan('periods');
  if (existing > 0) return { seeded: false };

  await put('plans', {
    id: CURRENT_PLAN_ID,
    title: 'Lifestyle Plan',
    subtitle: 'October 2026 – December 2027',
    owner: 'Andi',
    start: '2026-10-01',
    end: '2027-12-31',
    createdAt: new Date().toISOString(),
  });

  await putMany('periods', PERIODS);
  await putMany('vision', VISION);
  await putMany('budgetCategories', BUDGET_CATEGORIES);
  await putMany('financialMilestones', FINANCIAL_MILESTONES);
  await putMany('personalGoals', PERSONAL_GOALS);
  await putMany('careerState', CAREER_STATE);
  await putMany('careerMilestones', CAREER_MILESTONES);
  await putMany('careerActions', CAREER_ACTIONS);
  await putMany('skillMilestones', SKILL_MILESTONES);
  await putMany('reviewDefinitions', REVIEW_DEFINITIONS);
  await putMany('quarterlyCheckins', PERIODS.map((p, i) => ({
    id: `checkin-${p.id}`, order: i + 1, periodId: p.id,
    health: '', relationships: '', enrichment: '', notes: '',
  })));
  await putMany('changelog', [{
    id: 'cl-seed', order: 1, date: new Date().toISOString().slice(0, 10),
    description: 'Plan loaded from lifestyle-plan.md (Q4 2026 – Q4 2027).',
  }]);

  return { seeded: true };
}
