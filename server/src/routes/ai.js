import { Router } from 'express';
import { chatSessions } from '../data/demoData.js';
import { requireAuth } from '../middleware/auth.js';

export const aiRouter = Router();

aiRouter.post('/chat', requireAuth, (req, res) => {
  const message = String(req.body.message || '').trim();
  const lower = message.toLowerCase();

  let reply =
    'Please ask a financial or business question, for example about saving, budgeting, investment risk, spending, cash flow, or advisor consultation.';

  if (!message) {
    return res.status(400).json({ message: 'Please type a question first' });
  }

  if (
    lower.includes('separate') ||
    lower.includes('divide') ||
    lower.includes('split') ||
    lower.includes('manage my money')
  ) {
    reply =
      'A simple way to separate your money is to use 4 buckets: daily spending, bills, emergency savings, and investment. Put essential bills aside first, keep at least 3 months of expenses in emergency savings, then invest only the money you will not need soon.';
  } else if (lower.includes('save') || lower.includes('saving') || lower.includes('savings')) {
    reply =
      'Start with an automatic saving rule. Move a fixed amount into savings immediately after income arrives, then spend from what remains. A good first target is saving 10% to 20% of monthly income, depending on your expenses.';
  } else if (lower.includes('budget') || lower.includes('spend') || lower.includes('expense')) {
    reply =
      'Use a monthly budget with limits for housing, food, transport, debt payments, and personal spending. Review the biggest expense category first, because reducing one large cost usually helps more than cutting many small items.';
  } else if (lower.includes('invest')) {
    reply =
      'Before investing, protect your emergency fund and short-term cash needs. For a balanced risk profile, diversify between lower-risk fixed-income products and moderate-growth investments. Ask a human advisor before making large investment decisions.';
  } else if (lower.includes('cash') || lower.includes('business')) {
    reply =
      'For business cash flow, compare expected money coming in against payments due each week. If outflows are higher, negotiate supplier payment terms, delay non-critical purchases, and keep a working capital reserve.';
  } else if (lower.includes('risk')) {
    reply =
      'Financial risk usually comes from irregular income, high debt, weak emergency savings, or unusual transactions. Set alerts for high-value debits and review unfamiliar activity quickly.';
  } else if (lower.includes('advisor') || lower.includes('consultation') || lower.includes('help')) {
    reply =
      'If you want personal advice, request a consultation from the Consultations page. A relationship manager can review your financial profile and help with investment, savings, or business decisions.';
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
