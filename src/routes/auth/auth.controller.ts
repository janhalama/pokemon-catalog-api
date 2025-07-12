import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { EntityManager } from '@mikro-orm/core';
import { AuthService } from '../../services/auth.service';
import type { CreateUserRequest, LoginRequest } from '../../types/auth.types';

export class AuthController {
  constructor(private readonly fastify: FastifyInstance) {}

  async register(
    request: FastifyRequest<{ Body: CreateUserRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    const entityManager = this.getEntityManagerFromRequest(request);
    const authService = new AuthService(entityManager, this.fastify);
    const userData = request.body;
    const result = await authService.registerUser(userData);

    reply.status(200).send({
      success: true,
      data: result,
    });
  }

  async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    const entityManager = this.getEntityManagerFromRequest(request);
    const authService = new AuthService(entityManager, this.fastify);
    const loginData = request.body;
    const result = await authService.loginUser(loginData);

    reply.status(200).send({
      success: true,
      data: result,
    });
  }

  private getEntityManagerFromRequest(request: FastifyRequest): EntityManager {
    if (!request.entityManager) {
      throw new Error('EntityManager not available in request context');
    }
    return request.entityManager;
  }
} 