import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './src/entities';

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dbName: process.env.DB_NAME || 'pokemon_catalog',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  
  // Entity discovery
  entities: [User],
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
  debug: process.env.NODE_ENV === 'development',
}); 