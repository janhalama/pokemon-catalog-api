import { Type } from '@sinclair/typebox';
import { createResponseSchema } from '../../utils/schema.utils';

// Auth response data schema
const AuthResponseDataSchema = Type.Object({
  token: Type.String(),
  user: Type.Object({
    id: Type.Number(),
    email: Type.String({ format: 'email' }),
    name: Type.String()
  })
});

export const registerSchema = {
  description: 'Register a new user',
  tags: ['auth'],
  body: Type.Object({
    email: Type.String({ format: 'email', description: 'User email address' }),
    password: Type.String({ minLength: 8, description: 'User password (minimum 8 characters)' }),
    name: Type.String({ minLength: 2, maxLength: 100, description: 'User full name' })
  }),
  response: createResponseSchema(AuthResponseDataSchema)
};

export const loginSchema = {
  description: 'Login with email and password',
  tags: ['auth'],
  body: Type.Object({
    email: Type.String({ format: 'email', description: 'User email address' }),
    password: Type.String({ description: 'User password' })
  }),
  response: createResponseSchema(AuthResponseDataSchema)
}; 