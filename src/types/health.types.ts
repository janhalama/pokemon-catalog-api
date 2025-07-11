export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: string;
}

export interface HealthResponse {
  success: boolean;
  data: HealthStatus;
} 