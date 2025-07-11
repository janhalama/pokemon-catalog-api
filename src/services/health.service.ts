import type { HealthStatus } from '../types/health.types';
import { DatabaseService } from './database.service';

export class HealthService {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';

    // Check database connectivity
    let databaseStatus = 'unknown';
    try {
      const isDatabaseHealthy = await this.databaseService.ping();
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