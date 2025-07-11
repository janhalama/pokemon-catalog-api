import { FastifyRequest, FastifyReply } from 'fastify';
import { HealthService } from '../../services/health.service';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  async getHealthStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const healthData = await this.healthService.getHealthStatus();
      
      return reply.status(200).send({
        success: true,
        data: healthData
      });
    } catch (error) {
      request.log.error('Health check failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 500,
          message: 'Health check failed'
        }
      });
    }
  }
} 