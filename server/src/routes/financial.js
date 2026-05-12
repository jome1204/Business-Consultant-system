import { Router } from 'express';
import { createSavingsGoal, investments, savingsGoals } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const financialRouter = Router();

financialRouter.use(requireAuth);

financialRouter.get('/savings-goals', (req, res) => {
  res.json({
    savingsGoals: savingsGoals.filter((goal) => goal.userId === req.user.id)
  });
});

financialRouter.post('/savings-goals', (req, res) => {
  const targetAmount = Number(req.body.targetAmount || 0);
  if (!req.body.name || targetAmount <= 0) {
    return res.status(400).json({ message: 'Goal name and target amount are required' });
  }

  const goal = createSavingsGoal({
    userId: req.user.id,
    name: String(req.body.name).trim(),
    targetAmount,
    currentAmount: Number(req.body.currentAmount || 0),
    monthlyContribution: Number(req.body.monthlyContribution || 0),
    targetDate: req.body.targetDate || null
  });

  res.status(201).json({ goal });
});

financialRouter.get('/investments', (req, res) => {
  const portfolio = investments.filter((investment) => investment.userId === req.user.id);
  const totalInvested = portfolio.reduce((sum, item) => sum + item.amount, 0);
  const weightedReturn = totalInvested
    ? portfolio.reduce((sum, item) => sum + item.amount * item.returnRate, 0) / totalInvested
    : 0;

  res.json({
    investments: portfolio,
    summary: {
      totalInvested,
      weightedReturn: Number(weightedReturn.toFixed(1)),
      products: portfolio.length
    }
  });
});
