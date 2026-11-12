import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

let server;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Start HTTP server
  server = app.listen(env.PORT, () => {
    console.log(`[Server] Verdict Beach Backend running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
    console.log(`[Server] Local URL: http://localhost:${env.PORT}`);
    console.log(`[Server] Health Check: http://localhost:${env.PORT}/api/health`);
  });

  // Handle graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n[Server] ${signal} signal received. Starting graceful shutdown...`);
    if (server) {
      server.close(async () => {
        console.log('[Server] HTTP server closed');
        await disconnectDB();
        process.exit(0);
      });
    } else {
      await disconnectDB();
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('[Server] Uncaught Exception:', err);
    process.exit(1);
  });
}

startServer();
