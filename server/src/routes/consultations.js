import { Router } from 'express';
import { consultations, createConsultation } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const consultationRouter = Router();

consultationRouter.get('/', requireAuth, (req, res) => {
  const visible = consultations.filter(
    (item) =>
      item.customerId === req.user.id ||
      item.advisorId === req.user.id ||
      req.user.role === 'ADMIN'
  );

  res.json({ consultations: visible });
});

consultationRouter.post('/', requireAuth, (req, res) => {
  const consultation = createConsultation({
    customerId: req.user.id,
    advisorId: req.user.advisorId || 'u-advisor',
    topic: req.body.topic || 'Financial advisory',
    description: req.body.description || 'Customer requested advisor support.',
    scheduledAt: req.body.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
    channel: req.body.channel || 'CHAT'
  });

  res.status(201).json({ consultation });
});
