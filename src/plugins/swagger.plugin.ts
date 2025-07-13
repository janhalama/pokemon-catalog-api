import { getEnvironmentConfig } from '../config/environment';

const env = getEnvironmentConfig();

/**
 * Swagger OpenAPI configuration for API documentation
 * Provides OpenAPI 3.0 specification configuration
 */
export const swaggerConfig = {
  openapi: {
    info: {
      title: 'Pokemon Catalog API',
      description: `
A REST API for browsing Pokemon data and managing user favorites.

## Features

- **Authentication**: Secure user registration and login with JWT tokens
- **Pokemon Catalog**: Browse and search Pokemon with detailed information
- **Favorites Management**: Save and manage your favorite Pokemon
- **Health Monitoring**: API health checks and database connectivity status

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
\`Authorization: Bearer <your-jwt-token>\`

## Rate Limiting

API requests are rate-limited to ensure fair usage and system stability.

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes and descriptive messages.
      `,
      version: '1.0.0',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: env.API_BASE_URL,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http' as const,
          scheme: 'bearer' as const,
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      }
    },
    // Global security is not set here - individual routes will specify their security requirements
  },
  hideUntagged: false
}; 