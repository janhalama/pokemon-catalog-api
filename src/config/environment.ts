export function getEnvironmentConfig() {
  const config = {
    // Server configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    HOST: process.env.HOST || '0.0.0.0',

    // Logging configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Rate limiting configuration
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '1 minute',
  };

  return config;
}

/**
 * Type definition for environment configuration
 */
export type EnvironmentConfig = ReturnType<typeof getEnvironmentConfig>;
