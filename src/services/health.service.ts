import type { HealthStatus } from '../types/health.types';

export class HealthService {
  async getHealthStatus(): Promise<HealthStatus> {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';

    return {
      status: 'healthy',
      timestamp,
      uptime,
      environment
    };
  }
} 