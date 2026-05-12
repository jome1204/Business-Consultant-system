import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../data/demoData.js';
import { requireAuth, sanitizeUser, signToken } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => item.email.toLowerCase() === String(email || '').toLowerCase());

  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    token: signToken(user),
    user: sanitizeUser(user)
  });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

authRouter.patch('/me', requireAuth, (req, res) => {
  const allowedFields = ['fullName', 'language', 'riskAppetite'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      req.user[field] = String(req.body[field]).trim();
    }
  }

  res.json({ user: sanitizeUser(req.user) });
});

authRouter.post('/register', (req, res) => {
  res.status(201).json({
    message: 'Registration endpoint ready. Connect KYC and customer onboarding workflow before production use.'
  });
});
