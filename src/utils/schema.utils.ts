// Base response schemas
export const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: { type: 'object' }
  },
  required: ['success', 'data'],
  additionalProperties: false
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' }
  },
  required: ['success', 'error'],
  additionalProperties: false
};

export const messageResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' }
  },
  required: ['success', 'message'],
  additionalProperties: false
};

// Common HTTP status response schemas
export const commonResponseSchemas = {
  400: {
    description: 'Bad request',
    ...errorResponseSchema
  },
  401: {
    description: 'Unauthorized',
    ...errorResponseSchema
  },
  403: {
    description: 'Forbidden',
    ...errorResponseSchema
  },
  404: {
    description: 'Not found',
    ...errorResponseSchema
  },
  409: {
    description: 'Conflict',
    ...errorResponseSchema
  },
  422: {
    description: 'Unprocessable entity',
    ...errorResponseSchema
  },
  500: {
    description: 'Internal server error',
    ...errorResponseSchema
  }
};

// Helper function to create a complete response schema
export function createResponseSchema(
  successSchema: any,
  additionalResponses: Record<string, any> = {}
): Record<string, any> {
  return {
    200: {
      description: 'Successful response',
      ...successSchema
    },
    ...commonResponseSchemas,
    ...additionalResponses
  };
}

// Helper function to create a simple success response schema
export function createSuccessResponseSchema(dataSchema: unknown): unknown {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: dataSchema
    },
    required: ['success', 'data'],
    additionalProperties: false
  };
}

// Helper function to create a message response schema
export function createMessageResponseSchema(): unknown {
  return messageResponseSchema;
} 