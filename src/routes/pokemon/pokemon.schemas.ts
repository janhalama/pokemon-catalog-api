import { FastifySchema } from 'fastify';
import { createResponseSchema, createSuccessResponseSchema, createMessageResponseSchema } from '../../utils/schema.utils';

// Pokemon list query parameters schema
export const pokemonListQuerySchema = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      pattern: '^[1-9]\\d*$',
      description: 'Page number (must be positive integer)'
    },
    limit: {
      type: 'string',
      pattern: '^[1-9]\\d*$',
      description: 'Number of items per page (1-100)'
    },
    q: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Search query for Pokemon names'
    },
    type: {
      type: 'string',
      enum: [
        'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
        'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
      ],
      description: 'Filter by Pokemon type'
    },
    favorites: {
      type: 'string',
      enum: ['true', 'false'],
      description: 'Filter to show only user favorites'
    }
  },
  additionalProperties: false
};

// Pokemon by ID path parameters schema
export const pokemonByIdParamsSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[1-9]\\d*$',
      description: 'Pokemon ID (must be positive integer)'
    }
  },
  required: ['id'],
  additionalProperties: false
};

// Pokemon attack schema
const pokemonAttackSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
    damage: { type: 'number' }
  },
  required: ['name', 'type', 'damage'],
  additionalProperties: false
};

// Pokemon attacks schema
const pokemonAttacksSchema = {
  type: 'object',
  properties: {
    fast: {
      type: 'array',
      items: pokemonAttackSchema
    },
    special: {
      type: 'array',
      items: pokemonAttackSchema
    }
  },
  required: ['fast', 'special'],
  additionalProperties: false
};

// Pokemon evolution schema
const pokemonEvolutionSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' }
  },
  required: ['id', 'name'],
  additionalProperties: false
};

// Pokemon evolution requirements schema
const pokemonEvolutionRequirementsSchema = {
  type: 'object',
  properties: {
    amount: { type: 'number' },
    name: { type: 'string' }
  },
  required: ['amount', 'name'],
  additionalProperties: false
};

// Pokemon weight schema
const pokemonWeightSchema = {
  type: 'object',
  properties: {
    minimum: { type: 'string' },
    maximum: { type: 'string' }
  },
  required: ['minimum', 'maximum'],
  additionalProperties: false
};

// Pokemon height schema
const pokemonHeightSchema = {
  type: 'object',
  properties: {
    minimum: { type: 'string' },
    maximum: { type: 'string' }
  },
  required: ['minimum', 'maximum'],
  additionalProperties: false
};

// Individual Pokemon data schema
const pokemonDataSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    classification: { type: 'string' },
    types: {
      type: 'array',
      items: { type: 'string' }
    },
    resistant: {
      type: 'array',
      items: { type: 'string' }
    },
    weaknesses: {
      type: 'array',
      items: { type: 'string' }
    },
    weight: pokemonWeightSchema,
    height: pokemonHeightSchema,
    fleeRate: { type: 'number' },
    evolutionRequirements: pokemonEvolutionRequirementsSchema,
    evolutions: {
      type: 'array',
      items: pokemonEvolutionSchema
    },
    maxCP: { type: 'number' },
    maxHP: { type: 'number' },
    attacks: pokemonAttacksSchema
  },
  required: [
    'id', 'name', 'classification', 'types', 'resistant', 'weaknesses',
    'weight', 'height', 'fleeRate', 'evolutionRequirements', 'evolutions',
    'maxCP', 'maxHP', 'attacks'
  ],
  additionalProperties: false
};

// Pagination schema
const paginationSchema = {
  type: 'object',
  properties: {
    page: { type: 'number' },
    limit: { type: 'number' },
    total: { type: 'number' },
    totalPages: { type: 'number' }
  },
  required: ['page', 'limit', 'total', 'totalPages'],
  additionalProperties: false
};

// Pokemon list response schema
const pokemonListResponseSchema = {
  type: 'object',
  properties: {
    pokemon: {
      type: 'array',
      items: pokemonDataSchema
    },
    pagination: paginationSchema
  },
  required: ['pokemon', 'pagination'],
  additionalProperties: false
};



// Favorite response schema
const favoriteResponseSchema = {
  type: 'object',
  properties: {
    isFavorite: { type: 'boolean' }
  },
  required: ['isFavorite'],
  additionalProperties: false
};

// Pokemon list endpoint schema
export const pokemonListSchema = {
  description: 'Get a paginated list of Pokemon with optional search and filtering',
  tags: ['Pokemon'],
  summary: 'Get Pokemon list',
  querystring: pokemonListQuerySchema,
  response: createResponseSchema(createSuccessResponseSchema(pokemonListResponseSchema))
} as FastifySchema;

// Pokemon by ID endpoint schema
export const pokemonByIdSchema = {
  description: 'Get detailed information about a specific Pokemon',
  tags: ['Pokemon'],
  summary: 'Get Pokemon by ID',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(createSuccessResponseSchema(pokemonDataSchema))
} as FastifySchema;

// Add to favorites endpoint schema
export const addToFavoritesSchema = {
  description: 'Add a Pokemon to user favorites',
  tags: ['Favorites'],
  summary: 'Add Pokemon to favorites',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(createMessageResponseSchema())
} as FastifySchema;

// Remove from favorites endpoint schema
export const removeFromFavoritesSchema = {
  description: 'Remove a Pokemon from user favorites',
  tags: ['Favorites'],
  summary: 'Remove Pokemon from favorites',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(createMessageResponseSchema())
} as FastifySchema;

// Check favorite status endpoint schema
export const checkFavoriteStatusSchema = {
  description: 'Check if a Pokemon is in user favorites',
  tags: ['Favorites'],
  summary: 'Check favorite status',
  params: pokemonByIdParamsSchema,
  response: createResponseSchema(favoriteResponseSchema)
} as FastifySchema; 