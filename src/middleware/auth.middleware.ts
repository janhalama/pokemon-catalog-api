import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt.utils';
import type { JwtPayload, AuthenticatedUser } from '../types/auth.types';

declare module 'fastify' {
  interface FastifyRequest {
    authenticatedUser?: AuthenticatedUser;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      reply.status(401).send({
        success: false,
        error: 'Authorization header is required',
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      reply.status(401).send({
        success: false,
        error: 'Bearer token is required',
      });
      return;
    }

    const payload = verifyToken(request.server, token) as JwtPayload;
    
    // Attach user information to request
    request.authenticatedUser = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
    };

  } catch {
    reply.status(401).send({
      success: false,
      error: 'Invalid or expired token',
    });
  }
} 