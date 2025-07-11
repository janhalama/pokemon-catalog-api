import { FastifyInstance } from 'fastify';
import { createFastifyServer, configureErrorHandling, configureRequestLogging } from './config/fastify';
import { registerHealthRoutes } from './routes';

export class App {
  private server: FastifyInstance;

  constructor() {
    this.server = null as any;
  }

  async start(): Promise<void> {
    try {
      // Create and configure the server
      this.server = await createFastifyServer();
      
      // Configure error handling and logging
      configureErrorHandling(this.server);
      configureRequestLogging(this.server);

      // Register routes
      await this.registerRoutes();

      // Start the server
      const port = parseInt(process.env.PORT || '3000', 10);
      const host = process.env.HOST || '0.0.0.0';

      await this.server.listen({ port, host });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async registerRoutes(): Promise<void> {
    // Register health check routes
    await registerHealthRoutes(this.server);
  }

  async stop(): Promise<void> {
    if (this.server) {
      await this.server.close();
      this.server.log.info('Server stopped gracefully');
    }
  }

  getServer(): FastifyInstance {
    return this.server;
  }
} 