import { Router } from 'express';
import { accounts, businessReports, recommendations, transactions } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);

reportsRouter.get('/monthly', (req, res) => {
  const userTransactions = transactions.filter((transaction) => transaction.userId === req.user.id);
  const income = userTransactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = userTransactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalBalance = accounts
    .filter((account) => account.userId === req.user.id)
    .reduce((sum, account) => sum + account.balance, 0);

  res.json({
    period: 'May 2026',
    income,
    expenses,
    net: income - expenses,
    totalBalance,
    recommendationCount: recommendations.filter((item) => item.userId === req.user.id).length,
    summary:
      income > expenses
        ? 'Positive monthly cash flow. Continue increasing automated savings and reviewing investment allocation.'
        : 'Expenses exceeded income this month. Review discretionary spending and upcoming payment obligations.',
    businessReports: businessReports.filter((report) => report.userId === req.user.id)
  });
});
