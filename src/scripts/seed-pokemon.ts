import { MikroORM } from '@mikro-orm/core';
import { Pokemon } from '../entities/Pokemon';
import config from '../config/mikro-orm.config';

type PokemonData = {
  id: string;
  name: string;
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  fleeRate: number;
  evolutionRequirements: {
    amount: number;
    name: string;
  };
  evolutions: Array<{
    id: number;
    name: string;
  }>;
  maxCP: number;
  maxHP: number;
  attacks: {
    fast: Array<{
      name: string;
      type: string;
      damage: number;
    }>;
    special: Array<{
      name: string;
      type: string;
      damage: number;
    }>;
  };
};

async function fetchPokemonData(): Promise<PokemonData[]> {
  const url = 'https://raw.githubusercontent.com/ApocoHQ/backend-code-challenge/refs/heads/main/pokemons.json';
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.statusText}`);
  }
  
  return response.json();
}

async function seedPokemon(options: { shouldCloseOrm?: boolean } = {}): Promise<void> {
  console.log('Starting Pokemon seeding...');
  
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();
  
  try {
    
    // Check if Pokemon data already exists
    const existingCount = await em.count(Pokemon);
    if (existingCount > 0) {
      console.log(`Pokemon data already exists (${existingCount} records). Skipping seeding.`);
      return;
    }
    
    console.log('Fetching Pokemon data from remote source...');
    const pokemonData = await fetchPokemonData();
    
    console.log(`Found ${pokemonData.length} Pokemon to seed.`);
    
    // Create Pokemon entities
    const pokemonEntities = pokemonData.map(data => {
      const pokemon = new Pokemon();
      pokemon.externalId = data.id;
      pokemon.name = data.name;
      pokemon.classification = data.classification;
      pokemon.types = data.types;
      pokemon.resistant = data.resistant;
      pokemon.weaknesses = data.weaknesses;
      pokemon.weight = data.weight;
      pokemon.height = data.height;
      pokemon.fleeRate = data.fleeRate;
      // Handle Pokemon without evolution requirements (final evolutions)
      pokemon.evolutionRequirements = data.evolutionRequirements || {
        amount: 0,
        name: 'No evolution'
      };
      pokemon.evolutions = data.evolutions || [];
      pokemon.maxCP = data.maxCP;
      pokemon.maxHP = data.maxHP;
      pokemon.attacks = data.attacks;
      return pokemon;
    });
    
    // Persist all Pokemon entities
    await em.persistAndFlush(pokemonEntities);
    
    console.log(`Successfully seeded ${pokemonEntities.length} Pokemon!`);
    
  } catch (error) {
    console.error('Error seeding Pokemon data:', error);
    throw error;
  } finally {
    if (options?.shouldCloseOrm && orm) {
      await orm.close();
    }
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedPokemon({
    shouldCloseOrm: true,
  })
    .then(() => {
      console.log('Pokemon seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Pokemon seeding failed:', error);
      process.exit(1);
    });
}

export { seedPokemon }; 