import type { HealthStatus } from '../types/health.types';
import type { DatabaseHealthChecker } from '../types/database-health-checker.types';

/**
 * Provides health status for the application, including database connectivity.
 */
export class HealthService {
  private database: DatabaseHealthChecker;

  constructor(database: DatabaseHealthChecker) {
    this.database = database;
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';

    // Check database connectivity
    let databaseStatus = 'unknown';
    try {
      const isDatabaseHealthy = await this.database.ping();
      databaseStatus = isDatabaseHealthy ? 'connected' : 'disconnected';
    } catch (error) {
      databaseStatus = 'error';
      console.error('Database health check failed:', error);
    }

    // Determine overall status
    const status = databaseStatus === 'connected' ? 'healthy' : 'degraded';

    return {
      status,
      timestamp,
      uptime,
      environment,
      database: databaseStatus
    };
  }
} 