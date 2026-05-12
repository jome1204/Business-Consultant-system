import { Router } from 'express';
import { businessReports, transactions } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const businessRouter = Router();

businessRouter.use(requireAuth);

businessRouter.get('/overview', (req, res) => {
  if (req.user.role !== 'SME_CUSTOMER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Business insights are available for SME customers' });
  }

  const userTransactions = transactions.filter((transaction) => transaction.userId === req.user.id);
  const revenue = userTransactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = userTransactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const netCashFlow = revenue - expenses;
  const expenseRatio = revenue > 0 ? Math.round((expenses / revenue) * 100) : 0;

  res.json({
    revenue,
    expenses,
    netCashFlow,
    expenseRatio,
    revenueGrowth: 14,
    cashFlowRisk: expenseRatio > 80 ? 'High' : expenseRatio > 60 ? 'Medium' : 'Low',
    recommendations: [
      'Negotiate supplier payment windows to protect working capital.',
      'Move a fixed percentage of weekly revenue into a reserve account.',
      'Review high-value inventory purchases before seasonal demand changes.'
    ],
    trend: [
      { month: 'Jan', revenue: 280000, expenses: 204000 },
      { month: 'Feb', revenue: 310000, expenses: 231000 },
      { month: 'Mar', revenue: 260000, expenses: 214000 },
      { month: 'Apr', revenue: 390000, expenses: 286000 },
      { month: 'May', revenue, expenses }
    ]
  });
});

businessRouter.get('/reports', (req, res) => {
  res.json({
    reports: businessReports.filter((report) => report.userId === req.user.id)
  });
});
