import { FastifyRequest, FastifyReply } from 'fastify';
import { EntityManager } from '@mikro-orm/core';
import { PokemonService } from '../../services/pokemon.service';
import { ApiError } from '../../utils/api-error.utils';
import {
  PokemonListRoute,
  PokemonByIdRoute,
  FavoriteActionRoute,
  FavoriteStatusRoute
} from './pokemon.schemas';
import type {
  PokemonListOptions,
  PokemonListResponse,
  PokemonData,
  FavoriteResponse,
  FavoriteActionResponse
} from '../../types/pokemon.types';

declare module 'fastify' {
  interface FastifyRequest {
    authenticatedUser?: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export class PokemonController {
  async getPokemonList(
    request: FastifyRequest<PokemonListRoute>,
    reply: FastifyReply<PokemonListRoute>
  ): Promise<void> {
    const { page, limit, q, name, type, favorites } = request.query;
    const userId = request.authenticatedUser?.id;

    const entityManager = this.getEntityManagerFromRequest(request);
    const pokemonService = new PokemonService(entityManager);

    // Validate type parameter against database values if provided
    if (type) {
      const validTypes = await pokemonService.getPokemonTypes();
      if (!validTypes.includes(type)) {
        throw ApiError.badRequest(`Invalid Pokemon type. Valid types are: ${validTypes.join(', ')}`);
      }
    }

    // Validate favorites parameter
    if (favorites && favorites !== 'true' && favorites !== 'false') {
      throw ApiError.badRequest('Invalid favorites parameter. Must be "true" or "false"');
    }

    // Handle exact name search directly
    if (name) {
      const pokemon = await pokemonService.getPokemonByName(name);
      if (!pokemon) {
        throw ApiError.notFound('Pokemon not found');
      }
      reply.send({
        success: true,
        data: pokemon
      });
      return;
    }

    // Handle list/search functionality
    const options: PokemonListOptions = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search: q,
      type,
      favorites: favorites === 'true',
      userId
    };

    const result: PokemonListResponse = await pokemonService.getPokemonList(options);

    reply.send({
      success: true,
      data: result
    });
  }

  async getPokemonById(
    request: FastifyRequest<PokemonByIdRoute>,
    reply: FastifyReply<PokemonByIdRoute>
  ): Promise<void> {
    const { id } = request.params;

    const entityManager = this.getEntityManagerFromRequest(request);
    const pokemonService = new PokemonService(entityManager);
    const pokemon: PokemonData | null = await pokemonService.getPokemonById(id);

    if (!pokemon) {
      throw ApiError.notFound('Pokemon not found');
    }

    reply.send({
      success: true,
      data: pokemon
    });
  }

  async addToFavorites(
    request: FastifyRequest<FavoriteActionRoute>,
    reply: FastifyReply<FavoriteActionRoute>
  ): Promise<void> {
    const { id } = request.params;
    const userId = request.authenticatedUser?.id;

    if (!userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const entityManager = this.getEntityManagerFromRequest(request);
    const pokemonService = new PokemonService(entityManager);
    await pokemonService.addToFavorites(userId, id);

    const result: FavoriteActionResponse = {
      success: true,
      message: 'Pokemon added to favorites'
    };

    reply.send({
      success: true,
      data: result
    });
  }

  async removeFromFavorites(
    request: FastifyRequest<FavoriteActionRoute>,
    reply: FastifyReply<FavoriteActionRoute>
  ): Promise<void> {
    const { id } = request.params;
    const userId = request.authenticatedUser?.id;

    if (!userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const entityManager = this.getEntityManagerFromRequest(request);
    const pokemonService = new PokemonService(entityManager);
    await pokemonService.removeFromFavorites(userId, id);

    const result: FavoriteActionResponse = {
      success: true,
      message: 'Pokemon removed from favorites'
    };

    reply.send({
      success: true,
      data: result
    });
  }

  async checkFavoriteStatus(
    request: FastifyRequest<FavoriteStatusRoute>,
    reply: FastifyReply<FavoriteStatusRoute>
  ): Promise<void> {
    const { id } = request.params;
    const userId = request.authenticatedUser?.id;

    if (!userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const entityManager = this.getEntityManagerFromRequest(request);
    const pokemonService = new PokemonService(entityManager);
    const isFavorite: boolean = await pokemonService.checkFavoriteStatus(userId, id);

    const result: FavoriteResponse = {
      isFavorite
    };

    reply.send({
      success: true,
      data: result
    });
  }

  async getPokemonTypes(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const entityManager = this.getEntityManagerFromRequest(request);
    const pokemonService = new PokemonService(entityManager);
    const types: string[] = await pokemonService.getPokemonTypes();

    reply.send({
      success: true,
      data: types
    });
  }

  private getEntityManagerFromRequest(request: FastifyRequest): EntityManager {
    if (!request.entityManager) {
      throw new Error('EntityManager not available in request context');
    }
    return request.entityManager;
  }
} 