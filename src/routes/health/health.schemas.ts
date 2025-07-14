import { Type } from '@sinclair/typebox';
import { createResponseSchema } from '../../utils/schema.utils';

// Health response data schema
const HealthResponseDataSchema = Type.Object({
  status: Type.String(),
  timestamp: Type.String(),
  uptime: Type.Number(),
  environment: Type.String(),
  database: Type.String()
});

export const healthSchemas = {
  getHealth: {
    description: 'Get API health status',
    tags: ['health'],
    response: createResponseSchema(HealthResponseDataSchema)
  }
}; 