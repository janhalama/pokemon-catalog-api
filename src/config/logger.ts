import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import pino from 'pino';
import { getEnvironmentConfig } from './environment';

// Shared logger configuration
export const loggerConfig = {
  level: getEnvironmentConfig().LOG_LEVEL,
  transport: getEnvironmentConfig().NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  } : undefined,
  serializers: {
    req: (req: FastifyRequest) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
    res: (res: FastifyReply) => ({
      statusCode: res.statusCode,
    }),
  },
};

// Get logger from Fastify instance
export function getLogger(server: FastifyInstance) {
  return server.log;
}

// Create a standalone logger for non-Fastify contexts
export function createStandaloneLogger() {
  return pino(loggerConfig);
} 