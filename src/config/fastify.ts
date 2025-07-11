import fastify, { FastifyInstance } from 'fastify';
import { FastifyError } from '@fastify/error';
import { errorHandler, notFoundHandler, validationErrorHandler } from '../middleware/error-handler.middleware';

export async function createFastifyServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    trustProxy: true,
    disableRequestLogging: false,
  });

  // Register core plugins
  await server.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', '::1'],
    errorResponseBuilder: (request, context) => ({
      code: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${context.after}`,
      expiresIn: context.after,
    }),
  });

  // Register CORS for frontend integration
  await server.register(import('@fastify/cors'), {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Register security headers
  await server.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Register compression for better performance
  await server.register(import('@fastify/compress'), {
    threshold: 1024,
    encodings: ['gzip', 'deflate'],
  });

  return server;
}

export function configureErrorHandling(server: FastifyInstance): void {
  server.setErrorHandler((error: FastifyError, request, reply) => {
    // Check if this is a validation error
    if (error.validation) {
      return validationErrorHandler(error, request, reply);
    }

    // Use the dedicated error handler for all other errors
    return errorHandler(error, request, reply);
  });

  // Use the dedicated not found handler
  server.setNotFoundHandler(notFoundHandler);
}

export function configureRequestLogging(server: FastifyInstance): void {
  server.addHook('onRequest', (request, reply, done) => {
    request.log.info({
      type: 'request',
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });
    done();
  });
}
