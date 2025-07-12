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

export function isApiError(error: unknown): error is ApiError {
  if (error instanceof ApiError) {
    return true;
  }
  
  if (error === null || typeof error !== 'object') {
    return false;
  }
  
  const errorObj = error as Record<string, unknown>;
  return (
    'statusCode' in errorObj &&
    'message' in errorObj &&
    typeof errorObj.statusCode === 'number' &&
    typeof errorObj.message === 'string'
  );
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
        error: {
          code: error.statusCode,
          message: error.message,
        },
      });
    return;
  }

  // Handle other FastifyError instances
  const statusCode = error?.statusCode || 500;
  const message = error?.message || 'Internal Server Error';
  request.log.error(
    `Generic error: ${statusCode} ${message} (${error?.name}) url=${request.url}`
  );
  const isDevelopment = process.env.NODE_ENV === 'development';
  const responseMessage = isDevelopment ? message : 'Internal Server Error';
  reply
    .status(statusCode)
    .header('Content-Type', 'application/json')
    .send({
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
  reply.status(404).header('Content-Type', 'application/json').send({
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
  request.log.warn(
    `Validation error: ${error.message}, url: ${request.url}, method: ${request.method}`
  );
  reply.status(statusCode).header('Content-Type', 'application/json').send({
    success: false,
    error: {
      code: statusCode,
      message: 'Validation failed',
      details: error.validation || null,
    },
  });
}
