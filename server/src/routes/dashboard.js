import { Router } from 'express';
import {
  accounts,
  consultations,
  investments,
  notifications,
  recommendations,
  savingsGoals,
  transactions
} from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/overview', requireAuth, (req, res) => {
  const userAccounts = accounts.filter((account) => account.userId === req.user.id);
  const userTransactions = transactions.filter((transaction) => transaction.userId === req.user.id);
  const userRecommendations = recommendations.filter((recommendation) => recommendation.userId === req.user.id);
  const userConsultations = consultations.filter((consultation) => consultation.customerId === req.user.id);
  const userGoals = savingsGoals.filter((goal) => goal.userId === req.user.id);
  const userInvestments = investments.filter((investment) => investment.userId === req.user.id);
  const unreadNotifications = notifications.filter((notification) => notification.userId === req.user.id && !notification.read).length;

  const income = userTransactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const spending = userTransactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = userAccounts.reduce((sum, account) => sum + account.balance, 0);
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - spending) / income) * 100)) : 0;
  const financialScore = Math.min(95, Math.max(42, 58 + savingsRate));

  const spendingByCategory = Object.values(
    userTransactions
      .filter((transaction) => transaction.type === 'debit')
      .reduce((acc, transaction) => {
        acc[transaction.category] ||= { category: transaction.category, amount: 0 };
        acc[transaction.category].amount += transaction.amount;
        return acc;
      }, {})
  );

  res.json({
    balance,
    income,
    spending,
    savingsRate,
    financialScore,
    accounts: userAccounts,
    savingsGoals: userGoals,
    investments: userInvestments,
    unreadNotifications,
    spendingByCategory,
    recommendations: userRecommendations.slice(0, 3),
    consultations: userConsultations.slice(0, 2),
    business:
      req.user.role === 'SME_CUSTOMER'
        ? {
            revenueGrowth: 14,
            cashFlowRisk: 'Medium',
            expenseRatio: 75,
            projectedCashFlow: [
              { month: 'Jan', value: 280000 },
              { month: 'Feb', value: 310000 },
              { month: 'Mar', value: 260000 },
              { month: 'Apr', value: 390000 },
              { month: 'May', value: 315000 }
            ]
          }
        : null
  });
});
