import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User, Pokemon, Favorite } from '../entities';
import { getEnvironmentConfig } from './environment';

const env = getEnvironmentConfig();

export default defineConfig({
  driver: PostgreSqlDriver,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  
  // Entity discovery
  entities: [User, Pokemon, Favorite],
  entitiesTs: ['src/entities/**/*.ts'],
  
  // Migration configuration
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    tableName: 'migrations',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    snapshot: true,
  },
  
  // Schema generator configuration
  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
  
  // Connection pooling
  pool: {
    min: 2,
    max: 10,
  },
  
  // Debug configuration
  debug: env.NODE_ENV === 'development',
}); 