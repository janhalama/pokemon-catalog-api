import { FastifyInstance } from 'fastify';
import { generateToken, verifyToken, decodeToken } from './jwt.utils';
import type { JwtPayload } from '../types/auth.types';

// Mock Fastify instance
const createMockFastify = (): FastifyInstance => {
  const mockJwt = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  return {
    jwt: mockJwt,
  } as unknown as FastifyInstance;
};

describe('JWT Utils', () => {
  let mockFastify: FastifyInstance;

  beforeEach(() => {
    mockFastify = createMockFastify();
  });

  describe('generateToken', () => {
    it('should generate a token successfully', () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      const expectedToken = 'mock.jwt.token';
      (mockFastify.jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      const result = generateToken(mockFastify, payload);

      expect(result).toBe(expectedToken);
      expect(mockFastify.jwt.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = 'valid.jwt.token';
      const expectedPayload: JwtPayload = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };

      (mockFastify.jwt.verify as jest.Mock).mockReturnValue(expectedPayload);

      const result = verifyToken(mockFastify, token);

      expect(result).toEqual(expectedPayload);
      expect(mockFastify.jwt.verify).toHaveBeenCalledWith(token);
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid.jwt.token';
      const error = new Error('Invalid token');

      (mockFastify.jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(mockFastify, token)).toThrow('Invalid token');
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const token = 'valid.jwt.token';
      const expectedPayload: JwtPayload = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };

      (mockFastify.jwt.decode as jest.Mock).mockReturnValue(expectedPayload);

      const result = decodeToken(mockFastify, token);

      expect(result).toEqual(expectedPayload);
      expect(mockFastify.jwt.decode).toHaveBeenCalledWith(token);
    });

    it('should return null for invalid token', () => {
      const token = 'invalid.jwt.token';

      (mockFastify.jwt.decode as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = decodeToken(mockFastify, token);

      expect(result).toBeNull();
    });
  });
}); 