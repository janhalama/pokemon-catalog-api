import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { EntityManager } from '@mikro-orm/core';
import { AuthService } from '../../services/auth.service';
import type { CreateUserRequest, LoginRequest } from '../../types/auth.types';

export class AuthController {
  private authService: AuthService;

  constructor(em: EntityManager, fastify: FastifyInstance) {
    this.authService = new AuthService(em, fastify);
  }

  async register(
    request: FastifyRequest<{ Body: CreateUserRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    const userData = request.body;
    const result = await this.authService.registerUser(userData);

    reply.status(200).send({
      success: true,
      data: result,
    });
  }

  async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    const loginData = request.body;
    const result = await this.authService.loginUser(loginData);

    reply.status(200).send({
      success: true,
      data: result,
    });
  }
} 