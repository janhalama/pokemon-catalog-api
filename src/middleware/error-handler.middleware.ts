import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ApiError } from '../utils/api-error.utils';
import { getEnvironmentConfig } from '../config/environment';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function errorHandler(
  error: FastifyError | ApiError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  // Handle ApiError instances using the guard
  if (isApiError(error)) {
    if (error.statusCode >= 400 && error.statusCode < 500) {
      request.log.info(`Client error: ${error.statusCode} ${error.message}`);
    } else {
      request.log.error(`ApiError: ${error.statusCode} ${error.message}`);
    }
    reply
      .status(error.statusCode)
      .header('Content-Type', 'application/json')
      .send({
        success: false,
        error: error.message,
      });
    return;
  }

  // Handle other FastifyError instances
  const statusCode = error?.statusCode || 500;
  const message = error?.message || 'Internal Server Error';
  request.log.error(
    `Generic error: ${statusCode} ${message} (${error?.name}) url=${request.url}`
  );
  const isDevelopment = getEnvironmentConfig().NODE_ENV === 'development';
  const responseMessage = isDevelopment ? message : 'Internal Server Error';
  reply
    .status(statusCode)
    .header('Content-Type', 'application/json')
    .send({
      success: false,
      error: responseMessage,
    });
}

export function notFoundHandler(
  request: FastifyRequest,
  reply: FastifyReply
): void {
  reply.status(404).header('Content-Type', 'application/json').send({
    success: false,
    error: 'Route not found',
  });
}

export function validationErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const statusCode = 400;
  request.log.warn(
    `Validation error: ${error.message}, url: ${request.url}, method: ${request.method}`
  );
  reply.status(statusCode).header('Content-Type', 'application/json').send({
    success: false,
    error: 'Validation failed',
  });
}
