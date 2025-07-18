import { EntityManager } from '@mikro-orm/core';
import { Pokemon } from '../entities/Pokemon';
import { Favorite } from '../entities/Favorite';
import { User } from '../entities/User';
import { ApiError } from '../utils/api-error.utils';
import type { PokemonListOptions, PokemonListResponse, PokemonData } from '../types/pokemon.types';

type PokemonWhereConditions = {
  id?: number | { $in: number[] };
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

  async getPokemonById(externalId: string): Promise<PokemonData | null> {
    const pokemon = await this.em.findOne(Pokemon, { externalId });
    return pokemon ? this.mapToPokemonData(pokemon) : null;
  }

  async getPokemonByName(name: string): Promise<PokemonData | null> {
    // Use exact case-insensitive match
    const pokemon = await this.em.findOne(Pokemon, { 
      name: { $ilike: name.toLowerCase() } 
    }, { 
      orderBy: { name: 'ASC' } // Consistent ordering
    });
    
    // Verify exact match
    if (pokemon && pokemon.name.toLowerCase() === name.toLowerCase()) {
      return this.mapToPokemonData(pokemon);
    }
    
    return null;
  }

  async addToFavorites(userId: number, externalPokemonId: string): Promise<void> {
    // Check if Pokemon exists
    const pokemon = await this.em.findOne(Pokemon, { externalId: externalPokemonId });
    if (!pokemon) {
      throw ApiError.notFound(`Pokemon with ID ${externalPokemonId} not found`);
    }

    // Check if user exists
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw ApiError.notFound(`User with ID ${userId} not found`);
    }

    // Check if favorite already exists
    const existingFavorite = await this.em.findOne(Favorite, {
      user: { id: userId },
      pokemon: { id: pokemon.id }
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

  async removeFromFavorites(userId: number, externalPokemonId: string): Promise<void> {
    // Check if Pokemon exists
    const pokemon = await this.em.findOne(Pokemon, { externalId: externalPokemonId });
    if (!pokemon) {
      throw ApiError.notFound(`Pokemon with ID ${externalPokemonId} not found`);
    }

    // Find and remove favorite
    const favorite = await this.em.findOne(Favorite, {
      user: { id: userId },
      pokemon: { id: pokemon.id }
    });

    if (!favorite) {
      throw ApiError.notFound('Pokemon is not in favorites');
    }

    await this.em.removeAndFlush(favorite);
  }

  async checkFavoriteStatus(userId: number, externalPokemonId: string): Promise<boolean> {
    // Check if Pokemon exists
    const pokemon = await this.em.findOne(Pokemon, { externalId: externalPokemonId });
    if (!pokemon) {
      throw ApiError.notFound(`Pokemon with ID ${externalPokemonId} not found`);
    }

    // Check if favorite exists
    const favorite = await this.em.findOne(Favorite, {
      user: { id: userId },
      pokemon: { id: pokemon.id }
    });

    return !!favorite;
  }

  async getPokemonTypes(): Promise<string[]> {
    const result = await this.em.getConnection().execute(`
      SELECT DISTINCT jsonb_array_elements_text(types) as type
      FROM pokemon 
      WHERE types IS NOT NULL 
        AND jsonb_array_length(types) > 0
      ORDER BY type
    `);
    
    // Extract the type values from the result
    return result.map((row: { type: string }) => row.type);
  }

  private mapToPokemonData(pokemon: Pokemon): PokemonData {
    return {
      id: pokemon.externalId,
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