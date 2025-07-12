import { HealthService } from './health.service';
import type { DatabaseHealthChecker } from '../types/database-health-checker.types';

describe('HealthService', () => {
  let healthService: HealthService;
  let mockDatabase: jest.Mocked<DatabaseHealthChecker>;

  beforeEach(() => {
    mockDatabase = { ping: jest.fn() };
    healthService = new HealthService(mockDatabase);
  });

  describe('getHealthStatus', () => {
    it('should return health status with correct structure', async () => {
      mockDatabase.ping.mockResolvedValue(true);
      
      const result = await healthService.getHealthStatus();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('database');
    });

    it('should return valid timestamp', async () => {
      mockDatabase.ping.mockResolvedValue(true);
      
      const result = await healthService.getHealthStatus();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should return valid uptime', async () => {
      mockDatabase.ping.mockResolvedValue(true);
      
      const result = await healthService.getHealthStatus();

      expect(result.uptime).toBeGreaterThan(0);
      expect(typeof result.uptime).toBe('number');
    });

    it('should return environment from process.env or default', async () => {
      mockDatabase.ping.mockResolvedValue(true);
      
      const result = await healthService.getHealthStatus();

      expect(result.environment).toBeDefined();
      expect(typeof result.environment).toBe('string');
    });

    it('should return database status', async () => {
      mockDatabase.ping.mockResolvedValue(true);
      
      const result = await healthService.getHealthStatus();

      expect(result.database).toBeDefined();
      expect(typeof result.database).toBe('string');
      expect(['connected', 'disconnected', 'error', 'unknown']).toContain(result.database);
    });

    it('should return degraded status when database is disconnected', async () => {
      mockDatabase.ping.mockResolvedValue(false);
      
      const result = await healthService.getHealthStatus();

      expect(result.status).toBe('degraded');
      expect(result.database).toBe('disconnected');
    });

    it('should return degraded status when database throws error', async () => {
      mockDatabase.ping.mockRejectedValue(new Error('Database error'));
      
      const result = await healthService.getHealthStatus();

      expect(result.status).toBe('degraded');
      expect(result.database).toBe('error');
    });
  });
}); 