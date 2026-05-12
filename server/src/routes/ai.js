import { Router } from 'express';
import { chatSessions } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const aiRouter = Router();

aiRouter.post('/chat', requireAuth, (req, res) => {
  const message = String(req.body.message || '').trim();
  const lower = message.toLowerCase();

  let reply = 'I can help with savings, spending, investments, business cash flow, and advisor consultations.';

  if (lower.includes('save') || lower.includes('saving')) {
    reply = 'Based on your current pattern, start with an automated weekly saving plan and keep emergency savings separate from daily spending.';
  } else if (lower.includes('invest')) {
    reply = 'For a balanced risk profile, consider diversifying between fixed-income products and moderate-growth investment options. A human advisor should review high-value decisions.';
  } else if (lower.includes('cash') || lower.includes('business')) {
    reply = 'Your business should protect working capital by forecasting inflows and negotiating supplier payment terms where possible.';
  } else if (lower.includes('risk')) {
    reply = 'I see potential risk in irregular cash outflows. Set alerts for high-value debits and review unusual merchant activity quickly.';
  }

  const entry = {
    id: `chat-${Date.now()}`,
    userId: req.user.id,
    message,
    reply,
    createdAt: new Date().toISOString()
  };
  chatSessions.push(entry);

  res.json({ reply, entry });
});

aiRouter.get('/chat/sessions', requireAuth, (req, res) => {
  res.json({
    sessions: chatSessions.filter((session) => session.userId === req.user.id)
  });
});
