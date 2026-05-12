import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { recommendationRouter } from './routes/recommendations.js';
import { aiRouter } from './routes/ai.js';
import { consultationRouter } from './routes/consultations.js';
import { notificationRouter } from './routes/notifications.js';
import { adminRouter } from './routes/admin.js';
import { financialRouter } from './routes/financial.js';
import { businessRouter } from './routes/business.js';
import { reportsRouter } from './routes/reports.js';

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = new Set([
  clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
]);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Dashen AI Business Consultant API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/recommendations', recommendationRouter);
app.use('/api/ai', aiRouter);
app.use('/api/consultations', consultationRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/financial', financialRouter);
app.use('/api/business', businessRouter);
app.use('/api/reports', reportsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Unexpected server error'
  });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connection ready');
    } catch (error) {
      console.warn('MongoDB unavailable. API will continue with demo data.', error.message);
    }
  }

  app.listen(port, () => {
    console.log(`Dashen AI API running on http://localhost:${port}`);
  });
}

start();
