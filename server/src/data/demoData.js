import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const passwordHash = bcrypt.hashSync('password123', 10);

export const users = [
  {
    id: 'u-customer',
    fullName: 'Meron Bekele',
    email: 'customer@dashen.ai',
    passwordHash,
    role: 'CUSTOMER',
    language: 'English',
    kycStatus: 'VERIFIED',
    riskAppetite: 'Balanced',
    advisorId: 'u-advisor'
  },
  {
    id: 'u-sme',
    fullName: 'Tadesse Coffee Export PLC',
    email: 'sme@dashen.ai',
    passwordHash,
    role: 'SME_CUSTOMER',
    language: 'Amharic',
    kycStatus: 'VERIFIED',
    riskAppetite: 'Growth',
    advisorId: 'u-advisor'
  },
  {
    id: 'u-advisor',
    fullName: 'Selam Tesfaye',
    email: 'advisor@dashen.ai',
    passwordHash,
    role: 'ADVISOR',
    language: 'English',
    kycStatus: 'VERIFIED'
  },
  {
    id: 'u-admin',
    fullName: 'Dashen Platform Admin',
    email: 'admin@dashen.ai',
    passwordHash,
    role: 'ADMIN',
    language: 'English',
    kycStatus: 'VERIFIED'
  }
];

export const accounts = [
  { id: 'a-1', userId: 'u-customer', name: 'Dashen Everyday', type: 'Savings', balance: 184250, currency: 'ETB' },
  { id: 'a-2', userId: 'u-customer', name: 'Dashen Investment', type: 'Investment', balance: 95000, currency: 'ETB' },
  { id: 'a-3', userId: 'u-sme', name: 'SME Operating Account', type: 'Business', balance: 785000, currency: 'ETB' }
];

export const savingsGoals = [
  {
    id: 'sg-1',
    userId: 'u-customer',
    name: 'Emergency fund',
    targetAmount: 250000,
    currentAmount: 180000,
    monthlyContribution: 12000,
    targetDate: '2026-12-31'
  },
  {
    id: 'sg-2',
    userId: 'u-customer',
    name: 'Home deposit',
    targetAmount: 900000,
    currentAmount: 315000,
    monthlyContribution: 28000,
    targetDate: '2027-08-30'
  },
  {
    id: 'sg-3',
    userId: 'u-sme',
    name: 'Working capital reserve',
    targetAmount: 1200000,
    currentAmount: 470000,
    monthlyContribution: 80000,
    targetDate: '2027-03-31'
  }
];

export const investments = [
  {
    id: 'i-1',
    userId: 'u-customer',
    productName: 'Dashen Balanced Growth',
    category: 'Balanced fund',
    amount: 65000,
    returnRate: 11.8,
    riskLevel: 'Medium'
  },
  {
    id: 'i-2',
    userId: 'u-customer',
    productName: 'Treasury-backed income',
    category: 'Fixed income',
    amount: 30000,
    returnRate: 8.6,
    riskLevel: 'Low'
  },
  {
    id: 'i-3',
    userId: 'u-sme',
    productName: 'SME liquidity reserve',
    category: 'Money market',
    amount: 180000,
    returnRate: 7.4,
    riskLevel: 'Low'
  }
];

export const transactions = [
  { id: 't-1', userId: 'u-customer', category: 'Income', label: 'Salary', amount: 52000, type: 'credit', date: '2026-05-01' },
  { id: 't-2', userId: 'u-customer', category: 'Housing', label: 'Rent', amount: 18000, type: 'debit', date: '2026-05-03' },
  { id: 't-3', userId: 'u-customer', category: 'Transport', label: 'Fuel and taxi', amount: 6400, type: 'debit', date: '2026-05-06' },
  { id: 't-4', userId: 'u-customer', category: 'Food', label: 'Groceries and dining', amount: 9300, type: 'debit', date: '2026-05-08' },
  { id: 't-5', userId: 'u-sme', category: 'Revenue', label: 'Export settlement', amount: 420000, type: 'credit', date: '2026-05-02' },
  { id: 't-6', userId: 'u-sme', category: 'Inventory', label: 'Coffee supplier payment', amount: 230000, type: 'debit', date: '2026-05-04' },
  { id: 't-7', userId: 'u-sme', category: 'Payroll', label: 'Monthly payroll', amount: 85000, type: 'debit', date: '2026-05-09' }
];

export const recommendations = [
  {
    id: 'r-1',
    userId: 'u-customer',
    type: 'SAVINGS',
    title: 'Increase monthly savings by 8%',
    description: 'Your discretionary spending is stable. Moving 4,000 ETB more into savings each month can improve your financial health score.',
    confidenceScore: 92,
    priority: 'HIGH',
    status: 'NEW'
  },
  {
    id: 'r-2',
    userId: 'u-customer',
    type: 'INVESTMENT',
    title: 'Consider a balanced investment product',
    description: 'Your risk appetite and surplus cash flow fit a moderate-growth investment option.',
    confidenceScore: 84,
    priority: 'MEDIUM',
    status: 'VIEWED'
  },
  {
    id: 'r-3',
    userId: 'u-sme',
    type: 'BUSINESS',
    title: 'Renegotiate supplier payment window',
    description: 'Inventory payments are creating a cash-flow dip. A 15-day extension can reduce short-term liquidity pressure.',
    confidenceScore: 88,
    priority: 'HIGH',
    status: 'NEW'
  }
];

export const consultations = [
  {
    id: 'c-1',
    customerId: 'u-customer',
    advisorId: 'u-advisor',
    topic: 'Investment planning',
    description: 'Review balanced investment options for the next quarter.',
    scheduledAt: '2026-05-16T10:00:00.000Z',
    channel: 'VIDEO',
    status: 'SCHEDULED'
  },
  {
    id: 'c-2',
    customerId: 'u-sme',
    advisorId: 'u-advisor',
    topic: 'Business cash flow',
    description: 'Discuss supplier terms and cash flow plan.',
    scheduledAt: '2026-05-17T08:00:00.000Z',
    channel: 'CHAT',
    status: 'REQUESTED'
  }
];

export const notifications = [
  {
    id: 'n-1',
    userId: 'u-customer',
    title: 'Savings goal reminder',
    message: 'You are 72% toward your emergency fund goal.',
    type: 'SAVINGS',
    read: false,
    createdAt: '2026-05-10T09:20:00.000Z'
  },
  {
    id: 'n-2',
    userId: 'u-sme',
    title: 'Cash flow alert',
    message: 'Projected outflow exceeds inflow next week. Review supplier payments.',
    type: 'RISK',
    read: false,
    createdAt: '2026-05-10T12:40:00.000Z'
  }
];

export const businessReports = [
  {
    id: 'br-1',
    userId: 'u-sme',
    period: 'May 2026',
    revenue: 420000,
    expenses: 315000,
    netCashFlow: 105000,
    healthScore: 78,
    summary: 'Revenue is growing, but supplier payments are creating short-term liquidity pressure.'
  }
];

export const auditLogs = [
  {
    id: 'al-1',
    actor: 'Dashen Platform Admin',
    action: 'AI model confidence threshold reviewed',
    severity: 'INFO',
    createdAt: '2026-05-10T14:00:00.000Z'
  },
  {
    id: 'al-2',
    actor: 'System',
    action: 'High-priority cash flow alert generated for SME customer',
    severity: 'MEDIUM',
    createdAt: '2026-05-10T12:41:00.000Z'
  }
];

export const chatSessions = [];

export function createConsultation(payload) {
  const consultation = {
    id: uuid(),
    status: 'REQUESTED',
    createdAt: new Date().toISOString(),
    ...payload
  };
  consultations.unshift(consultation);
  return consultation;
}

export function createSavingsGoal(payload) {
  const goal = {
    id: uuid(),
    currentAmount: 0,
    createdAt: new Date().toISOString(),
    ...payload
  };
  savingsGoals.unshift(goal);
  return goal;
}

export function createNotification(payload) {
  const notification = {
    id: uuid(),
    read: false,
    createdAt: new Date().toISOString(),
    ...payload
  };
  notifications.unshift(notification);
  return notification;
}
