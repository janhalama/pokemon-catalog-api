import { EnvironmentConfig } from './environment';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from '../entities';

export function getDatabaseConfig(env: EnvironmentConfig, logger: (msg: string) => void) {
  return {
    driver: PostgreSqlDriver,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dbName: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: env.DB_SSL,
    
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
      safe: true,
      snapshot: true,
    },
    
    // Connection pooling
    pool: {
      min: 2,
      max: 10,
    },
    
    // Debug configuration
    debug: env.NODE_ENV === 'development',
    
    // Logging
    logger,
  };
} 