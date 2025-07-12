import { FastifyRequest } from 'fastify';
import { EntityManager } from '@mikro-orm/core';
import { DatabaseService } from '../services/database.service';

declare module 'fastify' {
  interface FastifyRequest {
    entityManager?: EntityManager;
  }
}

/**
 * Creates middleware that forks the EntityManager for each request
 * and attaches it to the request object for request-scoped database operations
 */
export function createEntityManagerMiddleware(databaseService: DatabaseService) {
  return async function entityManagerMiddleware(
    request: FastifyRequest
  ): Promise<void> {
    try {
      // Fork the EntityManager for this request
      const em = databaseService.getEntityManager().fork();
      request.entityManager = em;
    } catch (error) {
      request.log.error({ error }, 'Failed to create request-scoped EntityManager');
      throw new Error('Failed to create request-scoped EntityManager');
    }
  };
} 