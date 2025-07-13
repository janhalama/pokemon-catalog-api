import fastify, { FastifyInstance } from 'fastify';
import { FastifyError } from '@fastify/error';
import { errorHandler, notFoundHandler, validationErrorHandler } from '../middleware/error-handler.middleware';
import { ApiError } from '../utils/api-error.utils';
import { registerJwtPlugin } from '../plugins/jwt.plugin';
import { swaggerConfig } from '../plugins/swagger.plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { getEnvironmentConfig } from './environment';

export async function createFastifyServer(): Promise<FastifyInstance> {
  const env = getEnvironmentConfig();
  const server = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      } : undefined,
    },
    trustProxy: true,
    disableRequestLogging: false,
  });

  // Register core plugins
  await server.register(import('@fastify/rate-limit'), {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
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
    origin: env.NODE_ENV === 'development' 
      ? true // Allow all origins in development
      : env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  });

  // Register security headers
  await server.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", env.API_BASE_URL],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Compression disabled due to Fastify v5 + @fastify/compress v8 bug
  // See: https://github.com/fastify/fastify-compress/issues/350
  // await server.register(import('@fastify/compress'), {
  //   threshold: 1024
  // });

  // Register JWT plugin for authentication
  await registerJwtPlugin(server);

  // Register Swagger OpenAPI plugin for API documentation (before routes)
  await server.register(swagger, swaggerConfig);

  // Register Swagger UI plugin for API documentation (before routes)
  await server.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    }
  });

  return server;
}

export function configureErrorHandling(server: FastifyInstance): void {
  server.setErrorHandler((error: FastifyError | ApiError, request, reply) => {
    // Check if this is a validation error
    if ('validation' in error && error.validation) {
      return validationErrorHandler(error as FastifyError, request, reply);
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
