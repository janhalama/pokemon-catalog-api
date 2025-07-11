import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error with context
  request.log.error({
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      statusCode,
    },
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers,
      ip: request.ip,
    },
  });

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const responseMessage = isDevelopment ? message : 'Internal Server Error';

  // Send error response
  reply.status(statusCode).send({
    success: false,
    error: {
      code: statusCode,
      message: responseMessage,
    },
  });
}

export function notFoundHandler(
  request: FastifyRequest,
  reply: FastifyReply
): void {
  reply.status(404).send({
    success: false,
    error: {
      code: 404,
      message: 'Route not found',
      path: request.url,
    },
  });
}

export function validationErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const statusCode = 400;

  // Log validation error
  request.log.warn({
    error: {
      message: error.message,
      validation: error.validation,
    },
    request: {
      method: request.method,
      url: request.url,
      body: request.body,
      query: request.query,
      params: request.params,
    },
  });

  // Send validation error response
  reply.status(statusCode).send({
    success: false,
    error: {
      code: statusCode,
      message: 'Validation failed',
      details: error.validation,
    },
  });
}
