import { Router } from 'express';
import { auditLogs, consultations, notifications, recommendations, users } from '../data/demoData.js';
import { requireAuth, requireRole, sanitizeUser } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/users', (req, res) => {
  res.json({ users: users.map(sanitizeUser) });
});

adminRouter.get('/analytics', (req, res) => {
  res.json({
    totalUsers: users.length,
    activeCustomers: users.filter((user) => ['CUSTOMER', 'SME_CUSTOMER'].includes(user.role)).length,
    openConsultations: consultations.filter((item) => item.status !== 'COMPLETED').length,
    aiRecommendations: recommendations.length,
    unreadAlerts: notifications.filter((item) => !item.read).length,
    aiAccuracy: 87,
    monthlyEngagement: 74,
    systemHealth: 'Healthy',
    services: [
      { name: 'API', status: 'Operational' },
      { name: 'AI recommendation service', status: 'Operational' },
      { name: 'Notification worker', status: 'Operational' },
      { name: 'Core banking adapter', status: 'Sandbox' }
    ]
  });
});

adminRouter.get('/audit-logs', (req, res) => {
  res.json({ auditLogs });
});
