import { HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(() => {
    healthService = new HealthService();
  });

  describe('getHealthStatus', () => {
    it('should return health status with correct structure', async () => {
      const result = await healthService.getHealthStatus();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('database');
    });

    it('should return valid timestamp', async () => {
      const result = await healthService.getHealthStatus();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should return valid uptime', async () => {
      const result = await healthService.getHealthStatus();

      expect(result.uptime).toBeGreaterThan(0);
      expect(typeof result.uptime).toBe('number');
    });

    it('should return environment from process.env or default', async () => {
      const result = await healthService.getHealthStatus();

      expect(result.environment).toBeDefined();
      expect(typeof result.environment).toBe('string');
    });

    it('should return database status', async () => {
      const result = await healthService.getHealthStatus();

      expect(result.database).toBeDefined();
      expect(typeof result.database).toBe('string');
      expect(['connected', 'disconnected', 'error', 'unknown']).toContain(result.database);
    });
  });
}); 