/**
 * Schema utilities using TypeBox for Fastify
 * Provides reusable response schemas and helpers for API endpoints.
 */

import { Type, Static, TSchema } from '@sinclair/typebox';

// Success response schema factory
export function createSuccessResponseSchema<T extends TSchema>(dataSchema: T) {
  return Type.Object({
    success: Type.Literal(true),
    data: dataSchema
  });
}

// Error response schema
export const ErrorResponseSchema = Type.Object({
  success: Type.Literal(false),
  error: Type.String()
});

// Message response schema
export const MessageResponseSchema = Type.Object({
  success: Type.Literal(true),
  message: Type.String()
});

// Common error responses map
export const commonErrorResponses: Record<number, typeof ErrorResponseSchema> = {
  400: ErrorResponseSchema,
  401: ErrorResponseSchema,
  403: ErrorResponseSchema,
  404: ErrorResponseSchema,
  409: ErrorResponseSchema,
  422: ErrorResponseSchema,
  500: ErrorResponseSchema
};

// Full response schema factory
export function createResponseSchema<T extends TSchema>(
  successSchema: T,
  additional: Record<number, TSchema> = {}
) {
  return {
    200: createSuccessResponseSchema(successSchema),
    ...commonErrorResponses,
    ...additional
  };
}

// Type exports for runtime and static typing
export type SuccessResponse<T extends TSchema> = Static<ReturnType<typeof createSuccessResponseSchema<T>>>;
export type ErrorResponse = Static<typeof ErrorResponseSchema>;
export type MessageResponse = Static<typeof MessageResponseSchema>; 