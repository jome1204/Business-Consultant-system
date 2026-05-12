import mongoose from 'mongoose';

const { Schema } = mongoose;

export const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phoneNumber: String,
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['CUSTOMER', 'SME_CUSTOMER', 'RELATIONSHIP_MANAGER', 'ADVISOR', 'ADMIN'],
      default: 'CUSTOMER'
    },
    language: { type: String, default: 'English' },
    kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    riskAppetite: String,
    advisorId: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export const RecommendationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, enum: ['SAVINGS', 'INVESTMENT', 'RISK_ALERT', 'BUSINESS', 'SPENDING'] },
    title: String,
    description: String,
    confidenceScore: Number,
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
    status: { type: String, enum: ['NEW', 'VIEWED', 'ACCEPTED', 'DISMISSED'], default: 'NEW' },
    generatedBy: { type: String, enum: ['AI', 'ADVISOR'], default: 'AI' },
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const ConsultationSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    advisorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    topic: String,
    description: String,
    scheduledAt: Date,
    channel: { type: String, enum: ['CHAT', 'PHONE', 'VIDEO', 'IN_PERSON'], default: 'CHAT' },
    status: {
      type: String,
      enum: ['REQUESTED', 'ASSIGNED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED'
    },
    meetingLink: String,
    notes: String
  },
  { timestamps: true }
);

export const AccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Savings', 'Investment', 'Business', 'Checking'], required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'ETB' }
  },
  { timestamps: true }
);

export const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    category: { type: String, index: true },
    label: String,
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export const SavingsGoalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    monthlyContribution: { type: Number, default: 0 },
    targetDate: Date
  },
  { timestamps: true }
);

export const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    title: String,
    message: String,
    type: { type: String, enum: ['SAVINGS', 'RISK', 'PAYMENT', 'INVESTMENT', 'SYSTEM'] },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);
