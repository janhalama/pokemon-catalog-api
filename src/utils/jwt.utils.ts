import { FastifyInstance } from 'fastify';
import type { JwtPayload } from '../types/auth.types';

export function generateToken(fastify: FastifyInstance, payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return fastify.jwt.sign(payload);
}

export function verifyToken(fastify: FastifyInstance, token: string): JwtPayload {
  return fastify.jwt.verify(token) as JwtPayload;
}

export function decodeToken(fastify: FastifyInstance, token: string): JwtPayload | null {
  try {
    return fastify.jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
} 