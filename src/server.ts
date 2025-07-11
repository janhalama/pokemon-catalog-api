import dotenv from 'dotenv';
import { App } from './app';

dotenv.config();

async function startServer(): Promise<void> {
  const app = new App();

  // Handle graceful shutdown
  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    
    try {
      await app.stop();
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  // Set up signal handlers for graceful shutdown
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });

  try {
    // Start the application
    await app.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  });
}