export function getEnvironmentConfig() {
  const config = {
    // Server configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    HOST: process.env.HOST || '0.0.0.0',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',

    // Database configuration
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_NAME: process.env.DB_NAME || 'pokemon_catalog',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_SSL: process.env.DB_SSL === 'true',

    // Logging configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Rate limiting configuration
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '1 minute',

    JWT_SECRET: process.env.JWT_SECRET,
  };

  return config;
}

/**
 * Type definition for environment configuration
 */
export type EnvironmentConfig = ReturnType<typeof getEnvironmentConfig>;
