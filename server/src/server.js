import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBMode } from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import corridorRoutes from './routes/corridorRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logger (Development)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// System Health & DB Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AnnaSetu API Server',
    databaseMode: getDBMode(),
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount Resource Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/corridors', corridorRoutes);
app.use('/api/sync', syncRoutes);

// Serve Client Production Build (if built)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server and Connect Database
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
=====================================================
  AnnaSetu Surplus Food Rescue API Server
  Running on: http://localhost:${PORT}
  Health check: http://localhost:${PORT}/api/health
  Database Mode: ${getDBMode()}
=====================================================
`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
};

startServer();

export default app;
