import { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller';
import { healthSchemas } from './health.schemas';

export async function registerHealthRoutes(
  server: FastifyInstance, 
  healthController: HealthController
): Promise<void> {
  server.get('/api/health', {
    schema: healthSchemas.getHealth
  }, healthController.getHealthStatus.bind(healthController));
} 