import { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller';
import { healthSchemas } from './health.schemas';

export async function registerHealthRoutes(server: FastifyInstance): Promise<void> {
  const healthController = new HealthController();

  server.get('/health', {
    schema: healthSchemas.getHealth
  }, healthController.getHealthStatus.bind(healthController));
} 