import { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller';
import { healthSchemas } from './health.schemas';
import { DatabaseService } from '../../services/database.service';

export async function registerHealthRoutes(server: FastifyInstance, databaseService: DatabaseService): Promise<void> {
  const healthController = new HealthController(databaseService);

  server.get('/health', {
    schema: healthSchemas.getHealth
  }, healthController.getHealthStatus.bind(healthController));
} 