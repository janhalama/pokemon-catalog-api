// API-specific types for Pokemon endpoints
export type PokemonAttack = {
  name: string;
  type: string;
  damage: number;
};

export type PokemonAttacks = {
  fast: PokemonAttack[];
  special: PokemonAttack[];
};

export type PokemonEvolution = {
  id: number;
  name: string;
};

export type PokemonEvolutionRequirements = {
  amount: number;
  name: string;
};

export type PokemonWeight = {
  minimum: string;
  maximum: string;
};

export type PokemonHeight = {
  minimum: string;
  maximum: string;
};

// API response type for Pokemon data
export type PokemonData = {
  id: string;
  name: string;
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  weight: PokemonWeight;
  height: PokemonHeight;
  fleeRate: number;
  evolutionRequirements: PokemonEvolutionRequirements;
  evolutions: PokemonEvolution[];
  maxCP: number;
  maxHP: number;
  attacks: PokemonAttacks;
};

// API request/response types
export type PokemonListOptions = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  favorites?: boolean;
  userId?: number;
};

export type PokemonListResponse = {
  pokemon: PokemonData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type FavoriteResponse = {
  isFavorite: boolean;
};

export type FavoriteActionResponse = {
  success: boolean;
  message: string;
}; 