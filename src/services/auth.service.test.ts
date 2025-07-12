import { AuthService } from './auth.service';
import { User } from '../entities/User';
import type { CreateUserRequest, LoginRequest } from '../types/auth.types';
import bcrypt from 'bcrypt';
import * as passwordUtils from '../utils/password.utils';
import type { EntityManager } from '@mikro-orm/core';
import type { FastifyInstance } from 'fastify';

// Mock types that extend the actual interfaces
type MockEntityManager = EntityManager & {
  findOne: jest.Mock;
  create: jest.Mock;
  persistAndFlush: jest.Mock;
  fork: jest.Mock;
};

type MockFastifyInstance = FastifyInstance & {
  jwt: {
    sign: jest.Mock;
  };
};

// Mock Fastify instance
const createMockFastify = (): MockFastifyInstance => ({
  jwt: {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  },
} as MockFastifyInstance);

// Mock EntityManager
const createMockEntityManager = (): MockEntityManager => {
  const mockEm = {
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
  };
  
  return {
    ...mockEm,
    fork: jest.fn().mockReturnValue(mockEm),
  } as MockEntityManager;
};

describe('AuthService', () => {
  let authService: AuthService;
  let mockEm: MockEntityManager;
  let mockFastify: MockFastifyInstance;

  beforeEach(() => {
    mockEm = createMockEntityManager();
    mockFastify = createMockFastify();
    authService = new AuthService(mockEm, mockFastify);
    
    // Mock password hashing
    jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashed-password-123');
  });

  describe('registerUser', () => {
    const validUserData: CreateUserRequest = {
      email: 'test@example.com',
      password: 'TestPass123!',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      // Mock that user doesn't exist
      mockEm.findOne.mockResolvedValue(null);

      // Mock user creation
      const mockUser = {
        id: 1,
        email: validUserData.email,
        name: validUserData.name,
      };
      mockEm.create.mockReturnValue(mockUser as User);
      mockEm.persistAndFlush.mockResolvedValue(undefined);

      const result = await authService.registerUser(validUserData);

      expect(result).toEqual({
        token: 'mock.jwt.token',
        user: {
          id: 1,
          email: validUserData.email,
          name: validUserData.name,
        },
      });

      expect(mockEm.findOne).toHaveBeenCalledWith(User, { email: validUserData.email });
      expect(mockEm.create).toHaveBeenCalledWith(User, {
        email: validUserData.email,
        passwordHash: 'hashed-password-123',
        name: validUserData.name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockEm.persistAndFlush).toHaveBeenCalledWith(mockUser);
      expect(mockFastify.jwt.sign).toHaveBeenCalledWith({
        userId: 1,
        email: validUserData.email,
        name: validUserData.name,
      });
    });

    it('should throw error if user already exists', async () => {
      const existingUser = { id: 1, email: validUserData.email, name: 'Existing User' };
      mockEm.findOne.mockResolvedValue(existingUser as User);

      await expect(authService.registerUser(validUserData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('loginUser', () => {
    const validLoginData: LoginRequest = {
      email: 'test@example.com',
      password: 'TestPass123!',
    };

    it('should login user successfully with correct credentials', async () => {
      const mockUser = {
        id: 1,
        email: validLoginData.email,
        name: 'Test User',
        passwordHash: '$2b$12$hashedpassword',
      };

      mockEm.findOne.mockResolvedValue(mockUser as User);

      // Mock bcrypt compare to return true
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await authService.loginUser(validLoginData);

      expect(result).toEqual({
        token: 'mock.jwt.token',
        user: {
          id: 1,
          email: validLoginData.email,
          name: 'Test User',
        },
      });

      expect(mockEm.findOne).toHaveBeenCalledWith(User, { email: validLoginData.email });
      expect(mockFastify.jwt.sign).toHaveBeenCalledWith({
        userId: 1,
        email: validLoginData.email,
        name: 'Test User',
      });
    });

    it('should throw error for non-existent user', async () => {
      mockEm.findOne.mockResolvedValue(null);

      await expect(authService.loginUser(validLoginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        id: 1,
        email: validLoginData.email,
        name: 'Test User',
        passwordHash: '$2b$12$hashedpassword',
      };

      mockEm.findOne.mockResolvedValue(mockUser as User);

      // Mock bcrypt compare to return false
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(authService.loginUser(validLoginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockEm.findOne.mockResolvedValue(mockUser as User);

      const result = await authService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockEm.findOne).toHaveBeenCalledWith(User, { id: 1 });
    });

    it('should return null for non-existent user', async () => {
      mockEm.findOne.mockResolvedValue(null);

      const result = await authService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockEm.findOne.mockResolvedValue(mockUser as User);

      const result = await authService.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockEm.findOne).toHaveBeenCalledWith(User, { email: 'test@example.com' });
    });

    it('should return null for non-existent email', async () => {
      mockEm.findOne.mockResolvedValue(null);

      const result = await authService.getUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
}); 