import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schemas';

export async function registerAuthRoutes(
  fastify: FastifyInstance,
  authController: AuthController
): Promise<void> {
  // Register endpoint
  fastify.post('/api/auth/register', {
    schema: registerSchema,
    handler: authController.register.bind(authController),
  });

  // Login endpoint
  fastify.post('/api/auth/login', {
    schema: loginSchema,
    handler: authController.login.bind(authController),
  });
} 