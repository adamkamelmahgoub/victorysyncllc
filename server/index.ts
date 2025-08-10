
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { setupVite, log } from './vite';
import { createServer } from 'http';
import { healthCheck } from './db';

// Import routes
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import orgRoutes from './routes/org';
import integrationRoutes from './routes/integrations';
import billingRoutes from './routes/billing';
import webhookRoutes from './routes/webhooks';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Validate environment
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Let Vite handle CSP in dev
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true,
}));

// Request parsing
app.use('/api/webhooks', webhookRoutes); // Raw body for webhooks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = await healthCheck();
    const status = health.ok ? 200 : 503;
    
    res.status(status).json({
      ok: health.ok,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      ...health,
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/billing', billingRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(500).json({
    ok: false,
    error: 'server_error',
    message,
  });
});

async function startServer() {
  try {
    // Test database connection
    const health = await healthCheck();
    if (!health.db) {
      throw new Error('Database connection failed');
    }

    // Setup Vite in development
    if (process.env.NODE_ENV !== 'production') {
      await setupVite(app, server);
    } else {
      // Serve static files in production
      app.use(express.static('client/dist'));
      app.get('*', (req, res) => {
        res.sendFile('index.html', { root: 'client/dist' });
      });
    }

    server.listen(PORT, '0.0.0.0', () => {
      log(`Server running on http://0.0.0.0:${PORT}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log('✅ Database connected');
      
      if (process.env.NODE_ENV !== 'production') {
        log('🔧 Development mode with Vite HMR');
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  log(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    log('✅ HTTP server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    log('⚠️ Forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
startServer();
