import { EntityManager } from '@mikro-orm/core';
import { Pokemon } from '../entities/Pokemon';
import { Favorite } from '../entities/Favorite';
import { User } from '../entities/User';
import { ApiError } from '../utils/api-error.utils';
import type { PokemonListOptions, PokemonListResponse, PokemonData } from '../types/pokemon.types';

type PokemonWhereConditions = {
  id?: string | { $in: string[] };
  name?: { $ilike: string };
  types?: { $contains: string[] };
};

export class PokemonService {
  constructor(private readonly em: EntityManager) {}

  async getPokemonList(options: PokemonListOptions): Promise<PokemonListResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      favorites = false,
      userId
    } = options;

    // Validate pagination parameters
    const validatedLimit = Math.min(Math.max(limit, 1), 100);
    const validatedPage = Math.max(page, 1);
    const offset = (validatedPage - 1) * validatedLimit;

    // Build query using MikroORM's find method with where conditions
    const whereConditions: PokemonWhereConditions = {};

    // Apply search filter
    if (search) {
      whereConditions.name = { $ilike: `%${search.toLowerCase()}%` };
    }

    // Apply type filter
    if (type) {
      whereConditions.types = { $contains: [type] };
    }

    // Apply favorites filter - this requires a different approach with joins
    if (favorites && userId) {
      // For favorites, we need to use a different query approach
      // This is a simplified version - in production you might want to use raw SQL or a more complex query
      const favoritePokemon = await this.em.find(Favorite, { user: { id: userId } }, { populate: ['pokemon'] });
      const favoritePokemonIds = favoritePokemon.map(f => f.pokemon.id);
      
      // If user has no favorites, return empty result
      if (favoritePokemonIds.length === 0) {
        return {
          pokemon: [],
          pagination: {
            page: validatedPage,
            limit: validatedLimit,
            total: 0,
            totalPages: 0
          }
        };
      }
      
      whereConditions.id = { $in: favoritePokemonIds };
    }

    // Get total count for pagination
    const total = await this.em.count(Pokemon, whereConditions);

    // Apply pagination and get results
    const pokemonEntities = await this.em.find(Pokemon, whereConditions, {
      limit: validatedLimit,
      offset: offset,
      orderBy: { name: 'ASC' }
    });

    // Map entities to API response format
    const pokemon = pokemonEntities.map((entity: Pokemon) => this.mapToPokemonData(entity));

    return {
      pokemon,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages: Math.ceil(total / validatedLimit)
      }
    };
  }

  async getPokemonById(id: string): Promise<PokemonData | null> {
    const pokemon = await this.em.findOne(Pokemon, { id });
    return pokemon ? this.mapToPokemonData(pokemon) : null;
  }

  async addToFavorites(userId: number, pokemonId: string): Promise<void> {
    // Check if Pokemon exists
    const pokemon = await this.em.findOne(Pokemon, { id: pokemonId });
    if (!pokemon) {
      throw ApiError.notFound(`Pokemon with ID ${pokemonId} not found`);
    }

    // Check if user exists
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw ApiError.notFound(`User with ID ${userId} not found`);
    }

    // Check if favorite already exists
    const existingFavorite = await this.em.findOne(Favorite, {
      user: { id: userId },
      pokemon: { id: pokemonId }
    });

    if (existingFavorite) {
      throw ApiError.conflict('Pokemon is already in favorites');
    }

    // Create new favorite
    const favorite = new Favorite();
    favorite.user = user;
    favorite.pokemon = pokemon;

    await this.em.persistAndFlush(favorite);
  }

  async removeFromFavorites(userId: number, pokemonId: string): Promise<void> {
    const favorite = await this.em.findOne(Favorite, {
      user: { id: userId },
      pokemon: { id: pokemonId }
    });

    if (!favorite) {
      throw ApiError.notFound('Pokemon is not in favorites');
    }

    await this.em.removeAndFlush(favorite);
  }

  async checkFavoriteStatus(userId: number, pokemonId: string): Promise<boolean> {
    const favorite = await this.em.findOne(Favorite, {
      user: { id: userId },
      pokemon: { id: pokemonId }
    });

    return !!favorite;
  }

  private mapToPokemonData(pokemon: Pokemon): PokemonData {
    return {
      id: pokemon.id,
      name: pokemon.name,
      classification: pokemon.classification,
      types: pokemon.types,
      resistant: pokemon.resistant,
      weaknesses: pokemon.weaknesses,
      weight: pokemon.weight,
      height: pokemon.height,
      fleeRate: pokemon.fleeRate,
      evolutionRequirements: pokemon.evolutionRequirements,
      evolutions: pokemon.evolutions,
      maxCP: pokemon.maxCP,
      maxHP: pokemon.maxHP,
      attacks: pokemon.attacks
    };
  }
} 