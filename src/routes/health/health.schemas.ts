import { createResponseSchema, createSuccessResponseSchema } from '../../utils/schema.utils';

// Health response data schema
const healthResponseDataSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    timestamp: { type: 'string' },
    uptime: { type: 'number' },
    environment: { type: 'string' },
    database: { type: 'string' }
  },
  required: ['status', 'timestamp', 'uptime', 'environment', 'database']
};

export const healthSchemas = {
  getHealth: {
    description: 'Get API health status',
    tags: ['health'],
    response: createResponseSchema(createSuccessResponseSchema(healthResponseDataSchema))
  }
}; 