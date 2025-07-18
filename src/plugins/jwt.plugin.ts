import { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { getEnvironmentConfig } from '../config/environment';

export async function registerJwtPlugin(fastify: FastifyInstance): Promise<void> {
  const env = getEnvironmentConfig();
  const jwtSecret = env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  await fastify.register(jwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: '60m', // 60 minutes
    },
    verify: {
      maxAge: '60m',
    },
  });
} 