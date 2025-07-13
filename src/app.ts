import { FastifyInstance } from 'fastify';
import { createFastifyServer, configureErrorHandling, configureRequestLogging } from './config/fastify';
import { registerHealthRoutes, registerAuthRoutes, registerPokemonRoutes } from './routes';
import { DatabaseService } from './services/database.service';
import { HealthController } from './routes/health/health.controller';
import { AuthController } from './routes/auth/auth.controller';
import { createEntityManagerMiddleware } from './middleware/entity-manager.middleware';
import { getEnvironmentConfig } from './config/environment';

//Composition root of the application
export class App {
  private server?: FastifyInstance;
  private databaseService?: DatabaseService;

  constructor() {
    // Properties will be initialized in start() method
  }

  async start(): Promise<void> {
    try {
      // Create and configure the server
      this.server = await createFastifyServer();
      
      // Initialize database connection with logger function
      this.databaseService = new DatabaseService((msg: string) => this.server!.log.debug({ component: 'mikroorm' }, msg));
      await this.databaseService.initialize();
      await this.databaseService.connect();
      
      // Configure error handling and logging
      configureErrorHandling(this.server);
      configureRequestLogging(this.server);

      // Register routes
      await this.registerRoutes();

      // Start the server
      const env = getEnvironmentConfig();
      const port = env.PORT;
      const host = env.HOST;

      await this.server.listen({ port, host });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async registerRoutes(): Promise<void> {
    if (!this.server || !this.databaseService) {
      throw new Error('Server and database service must be initialized before registering routes');
    }
    
    // Register EntityManager middleware globally
    const entityManagerMiddleware = createEntityManagerMiddleware(this.databaseService);
    this.server.addHook('preHandler', entityManagerMiddleware);
    
    // Create controllers
    const healthController = new HealthController(this.databaseService);
    const authController = new AuthController(this.server);
    
    // Register health check routes
    await registerHealthRoutes(this.server, healthController);
    // Register authentication routes
    await registerAuthRoutes(this.server, authController);
    // Register Pokemon routes
    await registerPokemonRoutes(this.server);
  }

  async stop(): Promise<void> {
    if (this.server) {
      await this.server.close();
      this.server.log.info('Server stopped gracefully');
    }
    
    // Disconnect from database
    if (this.databaseService) {
      await this.databaseService.disconnect();
    }
  }

  getServer(): FastifyInstance {
    if (!this.server) {
      throw new Error('Server not initialized. Call start() first.');
    }
    return this.server;
  }
} 