import { createResponseSchema, createSuccessResponseSchema } from '../../utils/schema.utils';

// Auth response data schema
const authResponseDataSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' }
      },
      required: ['id', 'email', 'name']
    }
  },
  required: ['token', 'user']
};

export const registerSchema = {
  description: 'Register a new user',
  tags: ['auth'],
  body: {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address'
      },
      password: {
        type: 'string',
        minLength: 8,
        description: 'User password (minimum 8 characters)'
      },
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        description: 'User full name'
      }
    }
  },
  response: createResponseSchema(createSuccessResponseSchema(authResponseDataSchema))
};

export const loginSchema = {
  description: 'Login with email and password',
  tags: ['auth'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address'
      },
      password: {
        type: 'string',
        description: 'User password'
      }
    }
  },
  response: createResponseSchema(createSuccessResponseSchema(authResponseDataSchema))
}; 