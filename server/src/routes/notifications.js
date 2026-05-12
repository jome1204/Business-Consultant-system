import { Router } from 'express';
import { notifications } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const notificationRouter = Router();

notificationRouter.get('/', requireAuth, (req, res) => {
  res.json({
    notifications: notifications.filter((item) => item.userId === req.user.id)
  });
});

notificationRouter.patch('/read-all', requireAuth, (req, res) => {
  const userNotifications = notifications.filter((item) => item.userId === req.user.id);
  for (const notification of userNotifications) {
    notification.read = true;
  }

  res.json({ notifications: userNotifications });
});

notificationRouter.patch('/:id/read', requireAuth, (req, res) => {
  const notification = notifications.find((item) => item.id === req.params.id && item.userId === req.user.id);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  notification.read = true;
  res.json({ notification });
});
