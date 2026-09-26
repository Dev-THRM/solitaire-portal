import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import jobsRouter from './routes/jobs.routes';
import applicationsRouter from './routes/applications.routes';
import authRouter from './routes/auth.routes';
import categoriesRouter from './routes/categories.routes';
import categorizationRouter from './routes/categorization.routes';
// [DISABLED FOR BASIC TESTING]
// import { verifyEmailConfig } from './config/email';
import prisma from './config/db';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);

// ── Security & Parsing Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});



app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/apply', applicationsRouter);
app.use('/api/admin/categories', categoriesRouter);
app.use('/api/admin/applications', categorizationRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Startup ───────────────────────────────────────────────────────────────────
async function start() {
  // await verifyEmailConfig(); // [DISABLED FOR BASIC TESTING]
  app.listen(PORT, () => {
    console.log(`[START] Backend running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

start().catch(async (err) => {
  console.error('Failed to start server:', err);
  await prisma.$disconnect();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
