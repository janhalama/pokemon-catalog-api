import { Type } from '@sinclair/typebox';
import { createResponseSchema } from '../../utils/schema.utils';
import { Static } from '@sinclair/typebox';

// Pokemon list query parameters schema
export const pokemonListQuerySchema = Type.Object({
  page: Type.Optional(Type.String({ pattern: '^[1-9]\\d*$', description: 'Page number (must be positive integer)' })),
  limit: Type.Optional(Type.String({ pattern: '^[1-9]\\d*$', description: 'Number of items per page (1-100)' })),
  q: Type.Optional(Type.String({ minLength: 1, maxLength: 100, description: 'Fuzzy search query for Pokemon names (returns list of matches)' })),
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100, pattern: '^[a-zA-Z0-9\\s-]+$', description: 'Exact Pokemon name (returns single Pokemon, 404 if not found)' })),
  type: Type.Optional(Type.String({ description: 'Filter by Pokemon type (e.g., "Fire", "Water", "Grass")' })),
  favorites: Type.Optional(Type.String({ description: 'Filter to show only user favorites (use "true" or "false")' }))
});

export interface PokemonListRoute {
  Querystring: Static<typeof pokemonListQuerySchema>;
  Reply: {
    success: boolean;
    data: Static<typeof pokemonDataSchema> | Static<typeof pokemonListResponseSchema>;
  };
}

// Pokemon by ID params schema
export const pokemonByIdParamsSchema = Type.Object({
  id: Type.String({ description: 'Pokemon ID' })
});

export interface PokemonByIdRoute {
  Params: Static<typeof pokemonByIdParamsSchema>;
  Reply: {
    success: boolean;
    data: Static<typeof pokemonDataSchema>;
  };
}

// Pokemon attack schema
const pokemonAttackSchema = Type.Object({
  name: Type.String(),
  type: Type.String(),
  damage: Type.Number()
});

// Pokemon attacks schema
const pokemonAttacksSchema = Type.Object({
  fast: Type.Array(pokemonAttackSchema),
  special: Type.Array(pokemonAttackSchema)
});

// Pokemon evolution schema
const pokemonEvolutionSchema = Type.Object({
  id: Type.Number(),
  name: Type.String()
});

// Pokemon evolution requirements schema
const pokemonEvolutionRequirementsSchema = Type.Object({
  amount: Type.Number(),
  name: Type.String()
});

// Pokemon weight schema
const pokemonWeightSchema = Type.Object({
  minimum: Type.String(),
  maximum: Type.String()
});

// Pokemon height schema
const pokemonHeightSchema = Type.Object({
  minimum: Type.String(),
  maximum: Type.String()
});

// Individual Pokemon data schema
export const pokemonDataSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  classification: Type.String(),
  types: Type.Array(Type.String()),
  resistant: Type.Array(Type.String()),
  weaknesses: Type.Array(Type.String()),
  weight: pokemonWeightSchema,
  height: pokemonHeightSchema,
  fleeRate: Type.Number(),
  evolutionRequirements: pokemonEvolutionRequirementsSchema,
  evolutions: Type.Array(pokemonEvolutionSchema),
  maxCP: Type.Number(),
  maxHP: Type.Number(),
  attacks: pokemonAttacksSchema
});

// Pagination schema
const paginationSchema = Type.Object({
  page: Type.Number(),
  limit: Type.Number(),
  total: Type.Number(),
  totalPages: Type.Number()
});

// Pokemon list response schema
export const pokemonListResponseSchema = Type.Object({
  pokemon: Type.Array(pokemonDataSchema),
  pagination: paginationSchema
});

// Favorite response schema
export const favoriteResponseSchema = Type.Object({
  isFavorite: Type.Boolean()
});

// Favorite action response schema
export const favoriteActionResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String()
});

// Pokemon list endpoint schema
export const pokemonListSchema = {
  description: `Get Pokemon with flexible search options:
  
  - **No parameters**: Returns paginated list of all Pokemon
  - **name parameter**: Returns single Pokemon object by exact name (404 if not found)
  - **q parameter**: Returns list of Pokemon matching fuzzy search
  - **type parameter**: Filters by Pokemon type
  - **favorites parameter**: Shows only user favorites
  
  Note: 'name' and 'q' parameters serve different purposes - 'name' for exact matches, 'q' for fuzzy search.
  Response format: Single Pokemon object when using 'name' parameter, paginated list otherwise.`,
  tags: ['Pokemon'],
  summary: 'Get Pokemon list or search by exact/fuzzy name',
  querystring: pokemonListQuerySchema,
  response: {
    200: {
      description: 'Pokemon found',
      content: {
        'application/json': {
          schema: Type.Object({
            success: Type.Boolean(),
            data: Type.Union([pokemonDataSchema, pokemonListResponseSchema])
          })
        }
      }
    },
    404: {
      description: 'Pokemon not found (when using exact name search)',
      content: {
        'application/json': {
          schema: Type.Object({
            success: Type.Boolean(),
            error: Type.String()
          })
        }
      }
    }
  }
};

// Pokemon by ID endpoint schema
export const pokemonByIdSchema = {
  description: 'Get detailed information about a specific Pokemon',
  tags: ['Pokemon'],
  summary: 'Get Pokemon by ID',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(pokemonDataSchema)
};

// Add to favorites endpoint schema
export const addToFavoritesSchema = {
  description: 'Add a Pokemon to user favorites',
  tags: ['Favorites'],
  summary: 'Add Pokemon to favorites',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(favoriteActionResponseSchema)
};

// Remove from favorites endpoint schema
export const removeFromFavoritesSchema = {
  description: 'Remove a Pokemon from user favorites',
  tags: ['Favorites'],
  summary: 'Remove Pokemon from favorites',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(favoriteActionResponseSchema)
};

// Check favorite status endpoint schema
export const checkFavoriteStatusSchema = {
  description: 'Check if a Pokemon is in user favorites',
  tags: ['Favorites'],
  summary: 'Check favorite status',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(favoriteResponseSchema)
};

// Pokemon types endpoint schema
export const pokemonTypesSchema = {
  description: 'Get a list of all unique Pokemon types available in the database',
  tags: ['Pokemon'],
  summary: 'Get Pokemon types list',
  response: {
    200: {
      description: 'List of Pokemon types',
      content: {
        'application/json': {
          schema: Type.Object({
            success: Type.Boolean(),
            data: Type.Array(Type.String(), { description: 'Array of unique Pokemon types' })
          })
        }
      }
    }
  }
};

export interface FavoriteActionRoute {
  Params: Static<typeof pokemonByIdParamsSchema>;
  Reply: {
    success: boolean;
    data: Static<typeof favoriteActionResponseSchema>;
  };
}

export interface FavoriteStatusRoute {
  Params: Static<typeof pokemonByIdParamsSchema>;
  Reply: {
    success: boolean;
    data: Static<typeof favoriteResponseSchema>;
  };
}