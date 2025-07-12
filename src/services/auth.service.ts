import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { FastifyInstance } from 'fastify';
import { ApiError } from '../utils/api-error.utils';
import type { CreateUserRequest, LoginRequest, AuthResponse } from '../types/auth.types';

export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly fastify: FastifyInstance
  ) {}

  async registerUser(userData: CreateUserRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.em.findOne(User, { email: userData.email });
    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create new user
    const user = this.em.create(User, {
      email: userData.email,
      passwordHash,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(user);

    // Generate JWT token
    const token = generateToken(this.fastify, {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async loginUser(loginData: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await this.em.findOne(User, { email: loginData.email });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(loginData.password, user.passwordHash);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken(this.fastify, {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.em.findOne(User, { id: userId });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }
} 