import { FastifyRequest, FastifyReply } from 'fastify';
import { EntityManager } from '@mikro-orm/core';
import { PokemonService } from '../../services/pokemon.service';
import { ApiError } from '../../utils/api-error.utils';
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

interface PokemonListRoute {
  Querystring: {
    page?: string;
    limit?: string;
    q?: string;
    name?: string;
    type?: string;
    favorites?: string;
  };
  Reply: {
    success: boolean;
    data: PokemonListResponse | PokemonData;
  };
}

interface PokemonByIdRoute {
  Params: {
    id: string;
  };
  Reply: {
    success: boolean;
    data: PokemonData;
  };
}

interface FavoriteRoute {
  Params: {
    id: string;
  };
  Reply: {
    success: boolean;
    data: FavoriteResponse | FavoriteActionResponse;
  };
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
    request: FastifyRequest<FavoriteRoute>, 
    reply: FastifyReply<FavoriteRoute>
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
    request: FastifyRequest<FavoriteRoute>, 
    reply: FastifyReply<FavoriteRoute>
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
    request: FastifyRequest<FavoriteRoute>, 
    reply: FastifyReply<FavoriteRoute>
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