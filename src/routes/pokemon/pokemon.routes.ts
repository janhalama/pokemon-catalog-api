import { FastifyInstance } from 'fastify';
import { PokemonController } from './pokemon.controller';
import { authenticate } from '../../middleware/auth.middleware';
import {
  pokemonListSchema,
  pokemonByIdSchema,
  addToFavoritesSchema,
  removeFromFavoritesSchema,
  checkFavoriteStatusSchema,
  pokemonTypesSchema
} from './pokemon.schemas';

export async function registerPokemonRoutes(
  fastify: FastifyInstance
): Promise<void> {
  const pokemonController = new PokemonController();

  // Get Pokemon list with search and filtering
  fastify.get('/api/pokemon', {
    schema: pokemonListSchema,
    preHandler: authenticate,
    handler: pokemonController.getPokemonList.bind(pokemonController)
  });

  // Get Pokemon by ID
  fastify.get('/api/pokemon/:id', {
    schema: pokemonByIdSchema,
    preHandler: authenticate,
    handler: pokemonController.getPokemonById.bind(pokemonController)
  });

  // Add Pokemon to favorites
  fastify.post('/api/pokemon/:id/favorite', {
    schema: addToFavoritesSchema,
    preHandler: authenticate,
    handler: pokemonController.addToFavorites.bind(pokemonController)
  });

  // Remove Pokemon from favorites
  fastify.delete('/api/pokemon/:id/favorite', {
    schema: removeFromFavoritesSchema,
    preHandler: authenticate,
    handler: pokemonController.removeFromFavorites.bind(pokemonController)
  });

  // Check favorite status
  fastify.get('/api/pokemon/:id/favorite', {
    schema: checkFavoriteStatusSchema,
    preHandler: authenticate,
    handler: pokemonController.checkFavoriteStatus.bind(pokemonController)
  });

  // Get Pokemon types list
  fastify.get('/api/pokemon/types', {
    schema: pokemonTypesSchema,
    preHandler: authenticate,
    handler: pokemonController.getPokemonTypes.bind(pokemonController)
  });
} 