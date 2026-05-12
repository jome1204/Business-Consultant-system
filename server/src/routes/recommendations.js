import { Router } from 'express';
import { recommendations } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const recommendationRouter = Router();

recommendationRouter.get('/', requireAuth, (req, res) => {
  res.json({
    recommendations: recommendations.filter((item) => item.userId === req.user.id)
  });
});

recommendationRouter.post('/generate', requireAuth, (req, res) => {
  const generated = {
    id: `r-${Date.now()}`,
    userId: req.user.id,
    type: req.user.role === 'SME_CUSTOMER' ? 'BUSINESS' : 'SAVINGS',
    title: req.user.role === 'SME_CUSTOMER' ? 'Improve working capital buffer' : 'Automate weekly micro-savings',
    description:
      req.user.role === 'SME_CUSTOMER'
        ? 'Set aside 6% of weekly revenue into a reserve account to reduce operating cash pressure.'
        : 'A weekly transfer of 1,000 ETB can help you reach your emergency fund target faster.',
    confidenceScore: 86,
    priority: 'MEDIUM',
    status: 'NEW'
  };

  recommendations.unshift(generated);
  res.status(201).json({ recommendation: generated });
});

recommendationRouter.patch('/:id/status', requireAuth, (req, res) => {
  const recommendation = recommendations.find((item) => item.id === req.params.id && item.userId === req.user.id);
  if (!recommendation) {
    return res.status(404).json({ message: 'Recommendation not found' });
  }

  recommendation.status = req.body.status || recommendation.status;
  res.json({ recommendation });
});
